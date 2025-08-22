import React from "react";

export default function Tabs({ tabs = [], activeTab, onChange }) {
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                    <li key={tab.value} className="me-2">
                        <button
                            className={`inline-block p-4 rounded-t-lg border-b-2 
                                ${tab.disabled
                                    ? "text-gray-400 cursor-not-allowed dark:text-gray-500"
                                    : activeTab === tab.value
                                        ? "text-brand-500 border-brand-500 dark:text-brand-500 dark:border-brand-500"
                                        : "border-transparent hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300"}
                            `}
                            onClick={() => !tab.disabled && onChange(tab.value)}
                            disabled={tab.disabled}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
