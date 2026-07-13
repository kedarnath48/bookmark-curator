import { useEffect, useRef, useState } from 'react';
import Styles from './addModel.css'

interface AddModelProps {
    toggles: (key: string) => void
}


const AddModel = ({ toggles }: AddModelProps) => {
    const [inputValue, setInputValue] = useState('');
    const [domain, setDomain] = useState('');
    //useEffect(() => {
    //    let UrlTxt = ''
    //    try {
    //        if (!/^https?:\/\//i.test(inputValue)) {
    //            UrlTxt = `https://${inputValue}`;
    //        }
    //        const parseInput = new URL(UrlTxt)
    //        console.log("[input]", parseInput)
    //    } catch (err) {
    //        console.log(err)
    //    }
    //}, [inputValue])

    const inputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = () => {
        if (inputRef.current) {
            alert(`Submitted Value: ${inputRef.current.value}`);
        }
    };


    const handleInputChange = (text: string) => {
        setInputValue(text);

        let adjustedText = text;

        if (!/^https?:\/\//i.test(text)) {
            adjustedText = `https://${text}`;
        }

        try {
            const parsedUrl = new URL(adjustedText);
            console.log(parsedUrl)

            const host = parsedUrl.hostname.replace('www.', '');
            const hasValidTld = /\.[a-z]{2,}$/i.test(host);
            if (hasValidTld) {
                setDomain(host);
            } else {
                // setDomain('Typing a valid domain...');
            }
        } catch (error) {
            setDomain('');
            //setDomain('Typing...');
            //setDomain('Invalid or incomplete URL');
        }
    };

    console.log("addModel")
    return (
        <div id='add-dialog' style={{ margin: 'auto', width: '400px' }}>
            <div className="model-header">
                <div style={{ marginBottom: '12px' }}>URL</div>
            </div>
            <div className="">
                <input
                    type="text"
                    name="Link or Links" id="" placeholder="Link or Links separated by ,"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    //onChange={(e) => setInputValue(e.target.value)}
                    //ref={inputRef}
                    style={{ fontFamily: 'inherit', fontSize: 'inherit', marginBottom: '12px', width: '-webkit-fill-available' }} />
                <div className="quick-folders" style={{ marginTop: '15px' }}>
                    <strong></strong> {domain !== "" ? (domain) : ''}
                </div>
            </div>
            <div className="" style={{ marginLeft: 'auto', width: 'max-content' }}>
                <button className="cancelBtn" onClick={() => toggles("showDialog")}>cancel</button>
                <button type="submit" onClick={handleButtonClick}>submit</button>
            </div>
        </div>
    )
}

export default AddModel