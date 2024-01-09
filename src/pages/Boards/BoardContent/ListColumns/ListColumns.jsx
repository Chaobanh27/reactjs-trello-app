/* eslint-disable no-console */
import { Box, Button, TextField } from '@mui/material'
import Column from './Column/Column'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'

function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails, deleteCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Title is requied', { position: 'bottom-left' })
      return
    }

    //tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    await createNewColumn(newColumnData)

    //đóng trạng thái thêm column mới và clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle()
  }
  return (
    <SortableContext items={columns?.map(e => e._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden'
      }} >

        {columns?.map((value) => {
          //console.log(value)
          return <Column key={value._id} createNewCard={createNewCard} column={value} deleteColumnDetails = { deleteColumnDetails } deleteCard = { deleteCard }/>
        })}

        {!openNewColumnForm
          ? <Box
            sx={{
              minWidth: '200px',
              height:'200px',
              mx: 2,
              borderRadius: '6px',
              bgcolor: '#fffffff3d'
            }}
          >
            <Button
              onClick={toggleOpenNewColumnForm}
              startIcon={<AddIcon/>}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 2.1,
                color:'white',
                bgcolor:'black'
              }} >
            Add New Column
            </Button>
          </Box>
          : <Box
            sx={{
              minWidth: '250px',
              maxWidth:'250px',
              mx: 2,
              p:1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap:1
            }}
          >
            <TextField
              label = 'Enter column title...'
              type='text'
              size='small'
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              variant='outlined'
              autoFocus
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap:'8px' }} >
              <Button
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow:'none',
                  border:'0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor:(theme) => theme.palette.success.main }
                }}>
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color:'white',
                  cursor:'pointer',
                  '&:hover': { color:(theme) => theme.palette.success.main }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }


      </Box>
    </SortableContext>

  )
}

export default ListColumns