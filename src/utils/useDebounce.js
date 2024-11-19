import { useState, useEffect } from "react";

const useDebounce = (val, delay = 3000) => {
    const [ debounceVal, setDebounceVal ] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceVal(val);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [val]);

    return debounceVal;
}

export default useDebounce;