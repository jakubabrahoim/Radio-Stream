interface Props {
    viewType: string;
    currentView: string;
    caption: string;
    setView: Function;
    customClass?: string;
}

function ViewButton({
    viewType,
    currentView,
    caption,
    setView,
    customClass,
}: Props) {
    return (
        <button
            data-e2e={`countries-view-type-${viewType}`}
            className={`${
                currentView === viewType
                    ? 'bg-gray-800 text-white hover:bg-gray-800'
                    : 'hover:bg-gray-600'
            }
                 w-36 h-full p-2 hover:text-white transition duration-200
                 ${customClass}`}
            onClick={() => setView(viewType)}
        >
            {caption}
        </button>
    );
}

export default ViewButton;
