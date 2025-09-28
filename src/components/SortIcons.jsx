export function SortIconAsc()
{
    return(
        <svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            style={{ marginLeft: "4px" }}
            aria-hidden="true"
        >
            <path
                d="M0 6 L5 1 L10 6 Z"
                fill="currentColor"
            />
        </svg>
    );
}


export function SortIconDesc()
{
    return(
         <svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            style={{ marginLeft: "4px" }}
            aria-hidden="true"
        >
            <path
                d="M0 4 L5 9 L10 4 Z"
                fill="currentColor"
            />
        </svg>
    );
}
