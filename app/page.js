'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '../src/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemToUpdate, setItemToUpdate] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList) // Set the initial filter
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredInventory(filtered)
  }, [searchQuery, inventory])

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      await setDoc(docRef, { quantity: Number(itemQuantity) })
    }
    setItemName('')
    setItemQuantity('')
    setOpenAdd(false)
    await updateInventory()
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    const docRef = doc(collection(firestore, 'inventory'), itemToUpdate.name)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: Number(itemQuantity) })
    }
    setItemQuantity('')
    setOpenUpdate(false)
    setItemToUpdate(null)
    await updateInventory()
  }

  const handleDeleteSubmit = async (e) => {
    e.preventDefault()
    const docRef = doc(collection(firestore, 'inventory'), itemToDelete)
    await deleteDoc(docRef)
    setOpenDelete(false)
    setItemToDelete(null)
    await updateInventory()
  }

  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)
  const handleOpenUpdate = (item) => {
    setItemToUpdate(item)
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setItemToUpdate(null)
    setOpenUpdate(false)
  }
  const handleOpenDelete = (itemName) => {
    setItemToDelete(itemName)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setItemToDelete(null)
    setOpenDelete(false)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      {/* Add Item Modal */}
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <form onSubmit={handleAddSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Item Name"
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                type="number"
                label="Quantity"
                variant="outlined"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                fullWidth
                required
              />
              <Button type="submit" variant="contained">
                Add
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Update Item Modal */}
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Item
          </Typography>
          <form onSubmit={handleUpdateSubmit}>
            <Stack spacing={2}>
              <Typography variant="h6">{itemToUpdate?.name}</Typography>
              <TextField
                type="number"
                label="New Quantity"
                variant="outlined"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                fullWidth
                required
              />
              <Button type="submit" variant="contained">
                Update
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Delete Item Modal */}
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Item
          </Typography>
          <form onSubmit={handleDeleteSubmit}>
            <Typography variant="h6">
              Are you sure you want to delete "{itemToDelete}"?
            </Typography>
            <Stack spacing={2}>
              <Button type="submit" variant="contained" color="error">
                Delete
              </Button>
              <Button variant="outlined" onClick={handleCloseDelete}>
                Cancel
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleOpenAdd}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Stack direction="row" spacing={2} alignItems={'center'}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOpenDelete(name)}
                >
                  Remove
                </Button>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Stack>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => handleOpenUpdate({ name, quantity })}
                >
                  Update Quantity
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
