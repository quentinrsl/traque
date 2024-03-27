import useGame from "@/hook/useGame";
import { useState } from "react"
import Button from "../util/button";
import TextInput from "../util/textInput";

export default function ActionDrawer() {
    const [visible, setVisible] = useState(false);
    const { sendCurrentPosition } = useGame();

    return (
        <div className={"absolute w-screen  bottom-0 z-10 bg-gray-100 flex justify-center rounded-t-2xl transition-all duration-200 flex flex-col " + (visible ? "h-5/6" : "h-20")}>
            <img src="/icons/arrow_up.png" className={"w-full object-scale-down h-ful max-h-20 transition-all cursor-pointer duration-200 " + (visible && "rotate-180")} onClick={() => setVisible(!visible)} />
            {visible && <div className="flex flex-col w-full h-full">
                <div className="h-20 my-2">
                    <Button onClick={sendCurrentPosition} className="h-10">Update position</Button>
                </div>
                <div className="my-2">
                    <div className="h-20">
                        <TextInput placeholder="Enemy code" onClick={(i) => { console.log(i) }} />
                    </div>
                    <div className="h-20">
                        <Button onClick={sendCurrentPosition}>Capture target</Button>
                    </div>
                </div>
                <div className='shadow-lg m-5 p-2 flex flex-col text-center mx-auto w-4/5 rounded'>
                    <p className='text-xl text-black'>30min</p>
                    <p className='text-gray-700'> before penalty</p>
                    <div className='w-1/2 flex flex-row justify-center mx-auto'>
                        <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                        <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                        <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                    </div>
                </div>
                <div className="h-20 mb-0 mt-auto">
                        <Button onClick={sendCurrentPosition}>Log out</Button>
                </div>
            </div>
            }
        </div>
    )
}