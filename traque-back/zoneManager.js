import randomLocation, { randomCirclePoint } from 'random-location'
import { isInCircle } from './map_utils';

class ZoneManager {
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
            reductionDuration: 10,
            reductionInterval: 10,
            updateIntervalSeconds: 10,
        }
        this.shrinkFactor = null;
        //Live location of the zone
        this.currentZone = null;
        this.currentDecrement = null;

        //If the zone is shrinking, this is the target of the current shrinking
        //If the zone is not shrinking, this will be the target of the next shrinking
        this.nextZone = null;

        this.startDate = null;
        this.zoneSettings = zoneSettings;
        this.started = false;
        this.timeoutId = null;

        this.onZoneUpdate = onZoneUpdate;
        this.onNextZoneUpdate = onNextZoneUpdate
    }

    udpateSettings(newSettings) {
        this.zoneSettings = {newSettings, ...this.zoneSettings};
        this.shrinkFactor = Math.pow(this.zoneSettings.min.radius / this.zoneSettings.max.radius, 1/this.zoneSettings.reductionCount)
    }

    reset() {
        this.currentZoneCount = 0;
    }

    start() {
        this.started = true;
        this.startDate = new Date();
        requestAnimationFrame(tick);
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
        while(!ok) {
           res = randomCirclePoint({latitude: this.currentZone.lat, longitude: this.currentZone.long}, this.currentZone.radius - newRadius);
           ok = (isInCircle({lat: res.latitude, long: res.longitude}, this.zoneSettings.min.center, newRadius - this.zoneSettings.min.radius)) 
        }
        return {
            lat: res.latitude,
            long: res.longitude
        }
    }

    setNextZone() {
        //At this point, nextZone == currentZone, we need to update the next zone, the raidus decrement, and start a timer before the next shrink

        //last zone
        if(this.currentZoneCount == this.zoneSettings.currentZoneCount - 1) {
            //Copy values
            this.nextZone = {center: [...this.zoneSettings.min.center],...this.zoneSettings.min}
        }else {
            //TODO : compute next zone
            this.nextZone.center = this.getRandomNextCenter(this.nextZone.radius * this.shrinkFactor)
            this.nextZone.radius *= this.shrinkFactor;
            this.timeoutId = setTimeout(() => this.startShrinking(), 1000 * 60 * this.zoneSettings.reductionIntervalMinutes)
        }
    }

    startShrinking() {

    }

}