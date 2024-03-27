import useGame from "@/hook/useGame";
import { useState } from "react"
import Button, { GreenButton, RedButton } from "../util/button";
import TextInput from "../util/textInput";

export default function ActionDrawer() {
    const [visible, setVisible] = useState(false);
    const { sendCurrentPosition } = useGame();

    return (
        <div className={"fixed w-screen  bottom-0 z-10 bg-gray-100 flex justify-center rounded-t-2xl transition-all duration-200 flex flex-col " + (visible ? "h-full" : "h-20")}>
            <img src="/icons/arrow_up.png" className={"w-full object-scale-down h-ful max-h-20 transition-all cursor-pointer duration-200 " + (visible && "rotate-180")} onClick={() => setVisible(!visible)} />
            {visible && <div className="flex flex-col w-full h-full">
                <div className='shadow-lg mt-0  p-1 flex flex-col text-center mb-1 mt-auto mx-auto w-4/5 rounded'>
                    <div className='text-gray-700'>
                        <span className='text-lg text-black'>30min</span>
                        <span> before penalty</span>
                    </div>
                    <div className='w-1/2 flex flex-row justify-center mx-auto'>
                        <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                        <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                        <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                    </div>
                </div>
                <div className="h-20 my-1">
                    <Button onClick={sendCurrentPosition} className="h-10">Update position</Button>
                </div>
                <div className="h-20 my-1">
                    <Button onClick={sendCurrentPosition} className="h-10">Message log</Button>
                </div>
                <div className="h-20 my-1">
                    <GreenButton onClick={sendCurrentPosition}>See target info</GreenButton>
                </div>
                <div className="mt-1 mb-auto">
                    <div className="h-20 flex flex-row">
                        <TextInput placeholder="Enemy code" onClick={(i) => { console.log(i) }} />
                        <GreenButton onClick={sendCurrentPosition}>Capture target</GreenButton>
                    </div>
                </div>
                <div className="h-20 my-2">
                    <RedButton onClick={sendCurrentPosition}>Signal emergency</RedButton>
                </div>
                <div className="h-20 mb-0">
                    <RedButton color={"red"} onClick={sendCurrentPosition}>Log out</RedButton>
                </div>
            </div>
            }
        </div>
    )
}