import useGoBack from "@/hooks/useGoBack";

const BackButton = () => {
    const goBack = useGoBack();

    return (
        <div className="my-6">
            <button
                type="button"
                onClick={goBack}
                className="flex items-center text-sm text-brand-500 hover:text-brand-800 dark:text-gray-300 dark:hover:text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali
            </button>
        </div>
    );
};

export default BackButton;
