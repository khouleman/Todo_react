import React, {useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import _ from "lodash"
import {v4 as uuidv4} from 'uuid';

const item = {
    id: uuidv4(),
    name: "Clean the house"
}

const item2 = {
    id: uuidv4(),
    name: "Wash the car"
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
    const [text, setText] = useState("")
    // const [todo, setTodo] = useState([])

    // @ts-ignore
    const handleDragEnd = ({destination, source}) => {
        if (!destination) {
            return
        }
        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }

        //Creating a copy before removing it from state
        // @ts-ignore
        const itemCopy = {...state[source.droppableId].items[source.index]}
        setState(prev => {
            prev = {...prev}

            //remove from previous items array
            // @ts-ignore
            prev[source.droppableId].items.splice(source.index, 1)

            //add to new items array location
            // @ts-ignore
            prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

            return prev
        })
    }

    const addItem = () => {
        setState(prev => {
            return {
                ...prev,
                todo: {
                    title: "Todo",
                    items: [
                        {
                            id: uuidv4(),
                            name: text,
                        },
                        ...prev.todo.items
                    ]
                }
            }
        })
        setText("")
    }
    return (
        <div className='App'>
            <div>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
                <button onClick={addItem}>Add</button>
            </div>
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
                                                                    {el.name}
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
    );
}

export default App;
