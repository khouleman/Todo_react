import React, {useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import _ from "lodash"
import {v4 as uuidv4} from 'uuid';

const item = {
    id: uuidv4(),
    name: "Clean the house",
    description: "Lave la maison",
    priority: "1",
    assignedTo: "Me",
}

const item2 = {
    id: uuidv4(),
    name: "Wash the car",
    description: "Lave la maison",
    priority: "1",
    assignedTo: "Me",
}

function App() {
    const [state, setState] = useState({
        "todo": {
            title: "Todo",
            items: [item]
        },
        "in-progress": {
            title: "In-progress",
            items: [item2]
        },
        "done": {
            title: "Completed",
            items: []
        },
    })

    //list
    const [title, setTitle] = useState("")

    //card
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("")
    const [assignedTo, setAssignedTo] = useState("")

    const addList = () => {
        setState({
            ...state,
            [title]: {
                title: title,
                items: []
            }
        });
        setTitle("")
    }


    const reorder = (list: any, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    const handleDragEnd = ({destination, source}: any) => {
        console.log({destination, source, state});

        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;
        const newState: any = {...state};

        if (!destination) {
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }

        if (sourceId === destinationId) {
            const items = newState[sourceId].items;
            newState[sourceId].items = reorder(items, source.index, destination.index);
        } else {
            const item = newState[sourceId].items[source.index];
            newState[sourceId].items.splice(source.index, 1);
            newState[destinationId].items.splice(destination.index, 0, item);
        }

        setState(newState);
    }

    // @ts-ignore
    // const handleDragEnd = ({destination: destination, source: source}) => {
    //     console.log("from", source)
    //     console.log("to", destination)
    //
    //     if (!destination) {
    //         return
    //     }
    //     if (destination.index === source.index && destination.droppableId === source.droppableId) {
    //         return
    //     }
    //
    //     //Creating a copy before removing it from state
    //     // @ts-ignore
    //     const itemCopy = {...state[source.droppableId].items[source.index]}
    //     setState(prev => {
    //         prev = {...prev}
    //
    //         //remove from previous items array
    //         // @ts-ignore
    //         prev[source.droppableId].items.splice(source.index, 1)
    //
    //         //add to new items array location
    //         // @ts-ignore
    //         prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)
    //
    //         return prev
    //     })
    // }

    const addItem = () => {
        setState(prev => {
            return {
                ...prev,
                todo: {
                    title: "Todo",
                    items: [
                        {
                            id: uuidv4(),
                            name: name,
                            description: description,
                            priority: priority,
                            assignedTo: assignedTo,
                        },
                        ...prev.todo.items
                    ]
                }
            }
        })
        setName("")
        setDescription("")
        setPriority("")
        setAssignedTo("")
    }

    return (
        <div className='App'>
            <div className={'form-todo'}>
                <div className={'wrap'}>
                    <div className={'row'}>
                        <p className={'m0'}>Name of the new List :</p>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <button onClick={addList}>Add</button>
                </div>
                <div className={'wrap'}>
                    <div className={'row'}>
                        <p className={'m0'}>Name of the task :</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className={'row'}>
                        <p className={'m0'}>Description :</p>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <div className={'row'}>
                        <p className={'m0'}>Priority :</p>
                        <input type="text" value={priority} onChange={(e) => setPriority(e.target.value)}/>
                    </div>
                    <div className={'row'}>
                        <p className={'m0'}>Assigned to :</p>
                        <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}/>
                    </div>
                    <button onClick={addItem}>Add</button>
                </div>
            </div>
            <div className={'todo'}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (
                            <div className={"column"}>
                                <h3>{data.title}</h3>
                                <Droppable droppableId={key}>
                                    {(provided) => {
                                        return (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={"droppable-col"}
                                            >
                                                {data.items.map((el, index) => {
                                                    return (
                                                        <Draggable key={el.id} index={index} draggableId={el.id}>
                                                            {(provided, snapchot) => {
                                                                return (
                                                                    <div
                                                                        className={`item ${snapchot.isDragging && "dragging"}`}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <p>{el.name}</p>
                                                                        <p>{el.description}</p>
                                                                        <p>{el.priority}</p>
                                                                        <p>{el.assignedTo}</p>
                                                                    </div>
                                                                )
                                                            }}
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }}
                                </Droppable>
                            </div>
                        )
                    })}
                </DragDropContext>
            </div>
        </div>
    );
}

export default App;
