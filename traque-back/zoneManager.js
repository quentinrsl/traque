import randomLocation, { randomCirclePoint } from 'random-location'
import { getDistanceFromLatLon, isInCircle } from './map_utils.js';
import { map } from './util.js';

export class ZoneManager {
    constructor(onZoneUpdate, onNextZoneUpdate) {
        //Setings storing where the zone will start, end and how it should evolve
        //The zone will start by staying at its mzx value for reductionInterval minutes
        //and then reduce during reductionDuration minutes, then wait again...
        //The reduction factor is such that after reductionCount the zone will be the min zone
        //a call to onZoneUpdate will be made every updateIntervalSeconds when the zone is changing
        //a call to onNextZoneUpdate will be made when the zone reduction ends and a new next zone is announced
        this.zoneSettings = {
            min: {center: null, radius: null},
            max: {center: null, radius: null},
            reductionCount: 2,
            reductionDuration: 1,
            reductionInterval: 1,
            updateIntervalSeconds: 10,
        }
        this.shrinkFactor = null;
        //Live location of the zone
        this.currentZone =  {center: null, radius: null};

        //If the zone is shrinking, this is the target of the current shrinking
        //If the zone is not shrinking, this will be the target of the next shrinking
        this.nextZone = {center: null, radius: null};

        //Zone at the begining of the shrinking
        this.currentStartZone = {center: null, radius: null};

        this.startDate = null;
        this.started = false;
        this.updateIntervalId = null;
        this.nextZoneTimeoutId = null;

        this.onZoneUpdate = onZoneUpdate;
        this.onNextZoneUpdate = onNextZoneUpdate
    }

    /**
     * Update the settings of the zone, this can be done by passing an object containing the settings to change.
     * Unless specified, the durations are in minutes
     * Default config :
     * `this.zoneSettings = {
     *      min: {center: null, radius: null},
     *      max: {center: null, radius: null},
     *      reductionCount: 2,
     *      reductionDuration: 10,
     *      reductionInterval: 10,
     *      updateIntervalSeconds: 10,
     *  }`
     * @param {Object} newSettings The fields of the settings to udpate
     * @returns 
     */
    udpateSettings(newSettings) {
        //validate settings
        if(newSettings.reductionCount &&(typeof newSettings.reductionCount != "number" || newSettings.reductionCount <= 0)) {return false}
        if(newSettings.reductionDuration &&(typeof newSettings.reductionDuration != "number" || newSettings.reductionDuration <= 0)) {return false}
        if(newSettings.reductionInterval &&(typeof newSettings.reductionInterval != "number" || newSettings.reductionInterval <= 0)) {return false}
        if(newSettings.updateIntervalSeconds &&(typeof newSettings.updateIntervalSeconds != "number" || newSettings.updateIntervalSeconds <= 0)) {return false}
        if(newSettings.max && (typeof newSettings.max.radius != "number" || typeof newSettings.max.center.lat != "number" || typeof newSettings.max.center.lng != "number")) {return false}
        if(newSettings.min && (typeof newSettings.min.radius != "number" || typeof newSettings.min.center.lat != "number" || typeof newSettings.min.center.lng != "number")) {return false}
        this.zoneSettings = {...this.zoneSettings, ...newSettings};
        this.shrinkFactor = Math.pow(this.zoneSettings.min.radius / this.zoneSettings.max.radius, 1/this.zoneSettings.reductionCount)
        return true;
    }

    /**
     * Reinitialize the object and stop all the tasks
     */
    reset() {
        this.currentZoneCount = 0;
        this.started = false;
        if(this.updateIntervalId != null) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
        if(this.nextZoneTimeoutId != null) {
            clearTimeout(this.nextZoneTimeoutId);
            this.nextZoneTimeoutId = null;
        }
    }

    /**
     * Start the zone reduction sequence
    */
    start() {
        this.started = true;
        this.startDate = new Date();
        //initialize the zone to its max value
        this.nextZone = JSON.parse(JSON.stringify(this.zoneSettings.max));
        this.currentStartZone = JSON.parse(JSON.stringify(this.zoneSettings.max));
        this.currentZone = JSON.parse(JSON.stringify(this.zoneSettings.max));
        this.setNextZone();
    }

    /**
     * Get the center of the next zone, this center need to satisfy two properties
     * - it needs to be included in the current zone, this means that this new point should lie in the circle of center currentZone.center and radius currentZone.radius - newRadius
     * - it needs to include the last zone, which means that the center must lie in the center of center min.center and of radius newRadius - min.radius 
     * @param newRadius the radius that the new zone will have
     * @returns the coordinates of the new center as an object with lat and long fields
     */
    getRandomNextCenter(newRadius) {
        let ok = false;
        let res = null
        //take a random point satisfying both conditions
        while(!ok) {
            res = randomCirclePoint({latitude: this.currentZone.center.lat, longitude: this.currentZone.center.lng}, this.currentZone.radius - newRadius);
           ok = (isInCircle({lat:res.latitude, lng: res.longitude}, this.zoneSettings.min.center, newRadius - this.zoneSettings.min.radius)) 
        }
        return {
         lat: res.latitude,
         lng: res.longitude
        }
    }

    /**
     * Compute the next zone satifying the given settings, update the nextZone and currentStartZone
     * Wait for the appropriate duration before starting a new zone reduction if needed
     */
    setNextZone() {
        console.log("Setting next zone",this.currentZoneCount,this.zoneSettings.reductionCount)
        //At this point, nextZone == currentZone, we need to update the next zone, the raidus decrement, and start a timer before the next shrink
        //last zone
        if(this.currentZoneCount == this.zoneSettings.reductionCount - 1) {
            this.nextZone =JSON.parse(JSON.stringify(this.zoneSettings.min)) 
            this.currentStartZone =JSON.parse(JSON.stringify(this.zoneSettings.min)) 
            this.nextZoneTimeoutId = setTimeout(() => this.startShrinking(), 1000 * 60 * this.zoneSettings.reductionIntervalMinutes)
            this.currentZoneCount++;
        }else if(this.currentZoneCount < this.zoneSettings.reductionCount - 1){
            this.nextZone.center = this.getRandomNextCenter(this.nextZone.radius * this.shrinkFactor)
            console.log(this.nextZone, this.shrinkFactor)
            this.nextZone.radius *= this.shrinkFactor;
            console.log(this.nextZone, this.shrinkFactor)
            this.currentStartZone = JSON.parse(JSON.stringify(this.currentZone))
            this.onNextZoneUpdate({
                begin: JSON.parse(JSON.stringify(this.currentStartZone)),
                end: JSON.parse(JSON.stringify(this.nextZone))
            })
            this.nextZoneTimeoutId = setTimeout(() => this.startShrinking(), 1000 * 60 * this.zoneSettings.reductionIntervalMinutes)
            this.currentZoneCount++;
        }
    }

    /*
     * Start a task that will run periodically updatinng the zone size, and calling the onZoneUpdate callback
     * This will also periodically check if the reduction is over or not
     * If the reduction is over this function will call setNextZone
     */
    startShrinking() {
        const startTime = new Date();
        console.log("started shrinking")
        this.updateIntervalId = setInterval(() => {
            console.log("Shrink tick")
            const completed = ((new Date() - startTime) / (1000 * 60)) / this.zoneSettings.reductionDuration; 
            console.log(completed)
            this.currentZone.radius = map(completed, 0, 1, this.currentStartZone.radius, this.nextZone.radius)
            this.onZoneUpdate(JSON.parse(JSON.stringify(this.currentZone)))
            //Zone shrinking is over
            if(completed >= 1) {
                clearInterval(this.updateIntervalId);
                this.updateIntervalId = null;
                this.setNextZone();
                return;
            }
        }, this.zoneSettings.updateIntervalSeconds * 1000);
    }

}