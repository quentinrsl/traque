export default function Button({ children, ...props }) {
    return (<button {...props} className="bg-blue-600 hover:bg-blue-500 ease-out duration-200 text-white w-full p-4 shadow-sm rounded">
        {children}
    </button>)
}