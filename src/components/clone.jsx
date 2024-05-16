import React, { useEffect, useState } from "react";
import SampleSplitter from "./SampleSplitter";
import { useResizable } from "react-resizable-layout";
import { cn } from "../utils/cn";
import axios from 'axios';
const Clone = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [count, setCount] = useState({addCount:0,updateCount:0});
    const [data, setData] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null)
    const {
        isDragging: isTerminalDragging,
        position: terminalH,
        splitterProps: terminalDragBarProps,
      } = useResizable({
        axis: "y",
        initial: 150,
        min: 50,
        reverse: true,
      });
      const {
        isDragging: isFileDragging,
        position: fileW,
        splitterProps: fileDragBarProps,
      } = useResizable({
        axis: "x",
        initial: 250,
        min: 50,
      });
      const {
        isDragging: isPluginDragging,
        position: pluginW,
        splitterProps: pluginDragBarProps,
      } = useResizable({
        axis: "x",
        initial: 200,
        min: 50,
        reverse: true,
      });
      const fetchData = async () => {
        try {
            const response = await axios.get('https://backendtest-49o0.onrender.com/api/data/all');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            
        }
    };
      const handleCount = async () => {
        try {
            const response = await axios.get('https://backendtest-49o0.onrender.com/api/data/count');
            setCount(response.data);
        } catch (error) {
            console.error('Error fetching count:', error);
        }
    };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://backendtest-49o0.onrender.com/api/data/add', { name, description });
            console.log(response.data);
            handleCount()
            fetchData()
            setSelectedItemId(null)
            setName("");
            setDescription("");
            // Add any further logic here after successful submission
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://backendtest-49o0.onrender.com/api/data/update/${selectedItemId}`, { name, description });
            console.log(response.data);
            handleCount()
            fetchData()
            setSelectedItemId(null)
            setName("");
            setDescription("");
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };
    const handleUpdateButtonClick = (itemId) => {
        setSelectedItemId(itemId);
        const selectedItem = data.find(item => item._id === itemId);
        if (selectedItem) {
            setName(selectedItem.name);
            setDescription(selectedItem.description);
        }
    };
   useEffect(()=>{
    fetchData()
   },[])
      return (
        <div className={"flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"}>
          
          <div className={"flex grow"}>

            <div className={cn("shrink-0 contents", isFileDragging && "dragging")} style={{ width: fileW ,overflow:"hidden"}}>
            <div className="add-data-form-container"> {/* Apply CSS class */}
            <h2>Add Data</h2>
            <form onSubmit={selectedItemId?handleUpdate:handleSubmit}>
                <div className="form-group"> {/* Apply CSS class */}
                    <label>Name:</label>
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group"> {/* Apply CSS class */}
                    <label>Description:</label>
                    <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit">{selectedItemId?"Update Data":"Add Data"}</button>
            </form>
        </div>
            </div>
            <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
            <div className={"flex grow"}>
              <div className={cn("shrink-0 contents", isPluginDragging && "dragging")} style={{ width: pluginW }}>
              <p>Add Count: {count.addCount}</p>
                <p>Update Count: {count.updateCount}</p>
              </div>
              
            </div>
          </div>
          <SampleSplitter dir={"horizontal"} isDragging={isTerminalDragging} {...terminalDragBarProps} />
         
          <div className={cn("shrink-0 bg-darker contents", isTerminalDragging && "dragging")} style={{ height: terminalH }}>
          <div className="data-container">
                <h2>All Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length>0&&data?.map(item => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td><button onClick={() => handleUpdateButtonClick(item._id)}>Update</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
          
          
        </div>
      );
}

export default Clone
