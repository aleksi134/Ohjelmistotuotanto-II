import { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {Select} from '@mui/material';

const MoveDeleteSubcategory = () => {
    const [open, setOpen] = useState(false);
    const [subCategory, setsubCategory] = useState("");
    const [balance, setBalance] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [SubCategoryList, setSubCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setsubCategory("");
        setBalance("");
        setSelectedCategory("");
        setSelectedSubCategory("");
    };
    const handleDelete = () => {
        const userID = localStorage.getItem("UserID");
        const postUrl = "http://localhost:3001/subcategory/deactivate-subcategory";
                Axios.post(postUrl, {
                    SubCategoryName: selectedSubCategory,
                    UserID: userID
                }).then((response) => {
                    alert("Delete was successful");
                    setOpen(false);
                    setsubCategory("");
                    setBalance("");
                    setSelectedCategory("");
                    setSelectedSubCategory("");
                }).catch((response) => {
                    alert("Something went wrong");
                    console.log(response);
            })
    };

    const handleEditSubCategory = () => {
        const userID = localStorage.getItem("UserID");

        const postUrl = "http://localhost:3001/subcategory/update-subcategory";
        const getUrl = `http://localhost:3001/subcategory/user-${userID}/get-subcategory-details/subCategoryName-${selectedSubCategory}`

        Axios.get(getUrl)
            .then((response) => {
                setBalance(response.data[0].Balance)
                Axios.post(postUrl, {
                    NewSubCategoryName: subCategory,
                    NewCategory: selectedCategory,
                    UserID: userID,
                    SubCategoryName: selectedSubCategory
                }).then((response) => {
                    alert("successful insert");
                })
                setOpen(false);
                setsubCategory("");
                setBalance("");
                setSelectedCategory("");
                setSelectedSubCategory("");
            }).catch((response) => {
            alert("Something went wrong");
            console.log(response);
        })
    };

    const getUserCategories = () => {
        const userID = localStorage.getItem("UserID");
        const baseUrl = `http://localhost:3001/category/${userID}`;
        const updatedArray = [];
        Axios.get(baseUrl)
            .then((response) => {
                for (let x = 0; x < response.data.length; x++) {
                    if(response.data[x].CategoryName.toString() !== 'Available'){
                        const category = response.data[x].CategoryName;
                        updatedArray.push({ value: category });
                    }
                }
                setCategoryList(updatedArray);
            })

            .catch((response) => {
                console.log(response);
            });
    };

    const getUserSubCategories = () => {
        const userID = localStorage.getItem("UserID");
        const baseUrl = `http://localhost:3001/subcategory/${userID}`;
        const updatedArray = [];
        Axios.get(baseUrl).then((response) => {
                for (let x = 0; x < response.data.length; x++) {
                    if(response.data[x].SubCategoryName.toString() !== 'AvailableFunds'){
                        const subCategory = response.data[x].SubCategoryName;
                        updatedArray.push({value: subCategory});
                    }
                }
                setSubCategoryList(updatedArray);
            })
            .catch((response) => {
                console.log(response);
            });
    };

    const updateValues = () => {
        const userID = localStorage.getItem("UserID");
        const baseUrl = `http://localhost:3001/subcategory/user-${userID}/get-subcategory-details/subCategoryName-${selectedSubCategory}`;
        Axios.get(baseUrl)
        .then((response) => {
            setSelectedCategory(response.data[0].CategoryName);
            setBalance(response.data[0].Balance);
            setsubCategory(selectedSubCategory);
        });
    }

    useEffect(() => {
        getUserCategories();
    }, [open]);

    useEffect(() => {
        getUserSubCategories();
    }, [open]);

    useEffect(() => {
        if(selectedSubCategory !== ""){
            updateValues();
        }
    }, [selectedSubCategory]);

    return (
        <div className="subcategory-button">
            <Button id="subcategory-button-1" onClick={handleClickOpen}>
                (+) edit subcategory
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit subcategory</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To edit a sub category, you need to select a subcategory. You can change category or subcategorys
                        name if it is needed. It is also possible to delete subcategory by pressing the delete button.
                    </DialogContentText>

                    <FormControl required margin="dense">
                        <InputLabel id="Category-type-label">SubCategory</InputLabel>
                        <Select
                            style={{ height: "50px", width: "200px" }}
                            labelId="SubCategory-type-label"
                            id="SubCategory"
                            fullWidth
                            value={selectedSubCategory}
                            onChange={(event) => {
                                setSelectedSubCategory(event.target.value);
                            }}
                        >
                            {SubCategoryList.map((subCategory) => (
                                <MenuItem key={subCategory.value} value={subCategory.value}>
                                    {subCategory.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl required margin="dense">
                        <InputLabel id="SubCategory-type-label">Category</InputLabel>
                        <Select
                            style={{ height: "50px", width: "200px" }}
                            labelId="Category-type-label"
                            id="Category"
                            fullWidth
                            value={selectedCategory}
                            onChange={(event) => {
                                setSelectedCategory(event.target.value);
                            }}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.value} value={category.value}>
                                    {category.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="sub-category"
                        label="Subcategory name"
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                        value={subCategory}
                        variant="filled"
                        onChange={(event) => {
                            setsubCategory(event.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        disabled
                        margin="dense"
                        id="balance"
                        label="Balance"
                        fullWidth
                        inputProps={{ maxLength: 20 }}
                        value={balance}
                        variant="filled"
                        onChange={(event) => {
                            setBalance(event.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} className="delete-button">
                        Delete
                    </Button>
                    <Button onClick={handleClose} className="cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubCategory} className="Save-button">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MoveDeleteSubcategory