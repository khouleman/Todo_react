import React, {useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import _ from "lodash"
import {v4 as uuidv4} from 'uuid';
import {AppBar, Box, Button, IconButton, Modal, styled, TextField, Toolbar, Typography} from "@mui/material";
import Swal from 'sweetalert2'
import {green, purple} from "@mui/material/colors";

const ColorButton = styled(Button)(({theme}) => ({
    color: theme.palette.getContrastText(purple[300]),
    backgroundColor: "#d78afa",
    '&:hover': {
        backgroundColor: purple[500],
    },
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CssTextField = styled(TextField)({
    margin: 10,
    '& label.Mui-focused': {
        color: 'green',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'red',
        },
        '&:hover fieldset': {
            borderColor: 'grey',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'green',
        },
    },
});


const item = {
    id: uuidv4(),
    name: "Clean",
    description: "House",
    priority: "Important",
    assignedTo: "Nathan",
}

const item2 = {
    id: uuidv4(),
    name: "Wash",
    description: "Car",
    priority: "If you want",
    assignedTo: "P-J",
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
    // const [card, setCard] = useState([name, description, priority, assignedTo])

    const addList = () => {
        setState({
            ...state,
            [title]: {
                title: title,
                items: []
            }
        });

        setTitle("")
        setOpenList(false);
        Swal.fire({
            icon: 'success',
            title: 'Your list has been created',
            showConfirmButton: false,
            timer: 1500
        })
    }

    // @ts-ignore
    const reorder = (list, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    // @ts-ignore
    const handleDragEnd = ({destination, source}: Object) => {
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

    const removeTodo = () => {

    }
    const modifyItem = () => {
        // setState(prev => {
        //     return {
        //         ...prev,
        //         todo: {
        //             title: "todo",
        //             items: [
        //                 {
        //                     id: uuidv4(),
        //                     name: name,
        //                     description: description,
        //                     priority: priority,
        //                     assignedTo: assignedTo,
        //                 },
        //                 ...prev.todo.items
        //             ]
        //         }
        //     }
        // })

        setName("")
        setDescription("")
        setPriority("")
        setAssignedTo("")
        setOpenModify(false)
        Swal.fire({
            icon: 'success',
            title: 'Your card has been modified',
            showConfirmButton: false,
            timer: 1500
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

        // const newCard = [card, ...card];
        // // @ts-ignore
        // setCard(newCard);

        setName("")
        setDescription("")
        setPriority("")
        setAssignedTo("")

        setOpenCard(false);
        Swal.fire({
            icon: 'success',
            title: 'Your card has been created',
            showConfirmButton: false,
            timer: 1500
        })
    }

    const [openList, setOpenList] = React.useState(false);
    const [openCard, setOpenCard] = React.useState(false);
    const [openModify, setOpenModify] = React.useState(false);
    const handleOpenModify = () => {
        // console.log({...card})
        setOpenModify(true)
    }
    const handleCloseModify = () => setOpenModify(false);
    const handleOpenCard = () => setOpenCard(true);
    const handleOpenList = () => setOpenList(true);
    const handleCloseCard = () => setOpenCard(false);
    const handleCloseList = () => setOpenList(false);

    return (
        <><Box sx={{flexGrow: 1}}>
            <AppBar position="static" className={'navbar'}>
                <Toolbar className={'appbar'}>

                    <ColorButton onClick={handleOpenList}>New list</ColorButton>
                    <Modal
                        open={openList}
                        onClose={handleCloseList}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className={'boxContent'}>
                                <Typography id="modal-modal-title" variant="h2" component="h2">
                                    <CssTextField label="Name of the new List" id="custom-css-outlined-input"
                                                  className={'inputForm'} value={title}
                                                  onChange={(e) => setTitle(e.target.value)}/>
                                </Typography>
                                <div>
                                <Button variant="contained" onClick={addList} disabled={title.length === 0}
                                        color="success">
                                    Add List
                                </Button>
                                </div>
                            </div>
                        </Box>
                    </Modal>


                    <ColorButton onClick={handleOpenCard}>New card</ColorButton>
                    <Modal
                        open={openCard}
                        onClose={handleCloseCard}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className={'boxContent'}>
                                <Typography id="modal-modal-title" variant="h2" component="h2" className={'boxContent'}>
                                    <CssTextField label="Name of the task" id="custom-css-outlined-input" value={name}
                                                  onChange={(e) => setName(e.target.value)}/>
                                    <CssTextField label="Description" id="custom-css-outlined-input" value={description}
                                                  onChange={(e) => setDescription(e.target.value)}/>
                                    <CssTextField label="Priority" id="custom-css-outlined-input" value={priority}
                                                  onChange={(e) => setPriority(e.target.value)}/>
                                    <CssTextField label="Assigned to" id="custom-css-outlined-input" value={assignedTo}
                                                  onChange={(e) => setAssignedTo(e.target.value)}/>
                                </Typography>
                                <Button variant="contained" onClick={addItem} color="success"
                                        disabled={name.length === 0 || description.length === 0 || priority.length === 0 || assignedTo.length === 0}>
                                    Add card
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                </Toolbar>
            </AppBar>
        </Box>
            <div className='App'>
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

                                                                            <ColorButton onClick={handleOpenModify}>Modify</ColorButton>
                                                                            <ColorButton onClick={removeTodo}>Remove</ColorButton>
                                                                            <Modal
                                                                                open={openModify}
                                                                                onClose={handleCloseModify}
                                                                                aria-labelledby="modal-modal-title"
                                                                                aria-describedby="modal-modal-description"
                                                                            >
                                                                                <Box sx={style}>
                                                                                    <div className={'boxContent'}>
                                                                                        <Typography id="modal-modal-title" variant="h2" component="h2" className={'boxContent'}>
                                                                                            <CssTextField label="Name of the task" id="custom-css-outlined-input" value={name}
                                                                                                          onChange={(e) => setName(e.target.value)}/>
                                                                                            <CssTextField label="Description" id="custom-css-outlined-input" value={description}
                                                                                                          onChange={(e) => setDescription(e.target.value)}/>
                                                                                            <CssTextField label="Priority" id="custom-css-outlined-input" value={priority}
                                                                                                          onChange={(e) => setPriority(e.target.value)}/>
                                                                                            <CssTextField label="Assigned to" id="custom-css-outlined-input" value={assignedTo}
                                                                                                          onChange={(e) => setAssignedTo(e.target.value)}/>
                                                                                        </Typography>
                                                                                        <div>
                                                                                            <Button variant="contained" onClick={modifyItem} color="success"
                                                                                                    disabled={name.length === 0 || description.length === 0 || priority.length === 0 || assignedTo.length === 0}>
                                                                                                Modify
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </Box>
                                                                            </Modal>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </DragDropContext>
                </div>
            </div>
        </>
    )
        ;
}

export default App;
