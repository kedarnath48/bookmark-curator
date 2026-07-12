import Styles from './addModel.css'

interface AddModelProps {
    toggles: (key: string) => void
}


const AddModel = ({ toggles }: AddModelProps) => {
    console.log("addModel")
    return (
        <div id='add-dialog' style={{ margin: 'auto', width: '400px' }}>
            <div className="model-header">
                <div style={{ marginBottom: '12px' }}>URL</div>
            </div>
            <input
                type="text"
                name="Link or Links" id="" placeholder="Link or Links separated by ,"
                style={{ fontFamily: 'inherit', fontSize: 'inherit', marginBottom: '12px', width: '-webkit-fill-available' }} />
            <div className="" style={{ marginLeft: 'auto', width: 'max-content' }}>
                <button className="cancelBtn" onClick={() => toggles("showDialog")}>cancel</button>
                <button type="submit">submit</button>
            </div>
        </div>
    )
}

export default AddModel