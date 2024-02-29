import React from 'react'

const TabButton = ({ active, selectTab, children }) => {
    const buttonClasses = active ? "px-1 text-white border-l-4 border-purple-500" : "px-1 text-[#ADB7BE]"

    return (
        <button onClick={selectTab}>
            <p className={`mr-3 font-semibold hover:text-white ${buttonClasses}`}>
                {children}
            </p>
        </button>
    )
}

export default TabButton