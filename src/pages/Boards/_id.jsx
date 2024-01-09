/* eslint-disable no-console */
import { Container, Box, CircularProgress, Typography } from '@mui/material'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
//import { mockData } from '../../apis/mock-data'
import { createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI,
  updateColumnDetailsAPI,
  updateBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI,
  deleteCardAPI } from '../../apis'
import { useEffect, useState } from 'react'
import { generatePlaceHolderCard } from '../../utils/formatter'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'

function Board() {

  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '655661e4a79869e31e9cb1bc'
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceHolderCard(column)]
            column.cardOrderIds = [generatePlaceHolderCard(column)._id]
          }
        })
        setBoard(board)
      })
  }, [])

  //hàm này dùng để gọi API tạo mới Column và làm lại dữ liệu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    //console.log(createdColumn)
    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]

    //update state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  //hàm này dùng để gọi API tạo mới Card và làm lại dữ liệu state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: '655661e4a79869e31e9cb1bc'
    })
    //console.log(createdCard)

    //update state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
      else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }

    }
    setBoard(newBoard)
  }

  //chỉ cần gọi API để cập nhật mảng columnOrderIds của board chứa nó (thay đổi vị trí trong mảng)
  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const boardId = '655661e4a79869e31e9cb1bc'
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)
    //gọi api update board
    await updateBoardDetailsAPI(boardId, { columnOrderIds: newBoard.columnOrderIds })
  }

  //chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
  const moveCardIntheSameColumn = async (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds

      //console.log(columnToUpdate.cards)
      //console.log(columnToUpdate.cardOrderIds)
    }
    setBoard(newBoard)

    //gọi API update column
    await updateColumnDetailsAPI(columnId, { cardOrderIds : dndOrderedCardIds })

  }

  // Khi di chuyển card sang column khác
  // B1 : cập nhật mảng cardOrderIds của column ban đầu chứa nó ( xóa cái id của card đó ra khỏi mảng )
  // B2 : cập nhật mảng cardOrderIds của column tiếp theo ( thêm id của card đó vào mảng )
  // B3 : cập nhật lại trường columnId mới của card đã kéo
  // => làm API hỗ trợ riếng

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumn) => {
    //update cho đúng dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumn.map(c => c._id)
    const newBoard = { ...Board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    //gọi API xử lý
    let prevCardOrderIds = dndOrderedColumn.find(c => c._id === prevColumnId)?.cardOrderIds
    let nextCardOrderIds = dndOrderedColumn.find(c => c._id === nextColumnId)?.cardOrderIds
    //xử lý lỗi khi kéo tất cả card ra khỏi column, column rỗng mặc định sẽ có placeholder card,cần xóa nó đi trước khi gửi dữ liệu lên BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    if (nextCardOrderIds[0].includes('placeholder-card')) nextCardOrderIds.shift()

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds
    })
  }

  //xóa một column và cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    //console.log(columnId)
    //update cho đúng dữ liệu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(c => c !== columnId)
    setBoard(newBoard)

    //gọi API xử lý
    deleteColumnDetailsAPI(columnId).then(res => {
      //console.log(res)
      toast.success(res?.deleteResult)
    })
  }

  //xóa một card
  const deleteCard = (cardId) => {
    //update cho đúng dữ liệu state board
    const newBoard = { ...board }
    newBoard.columns.map(c => {
      let findCard = c.cards.findIndex(e => e._id == cardId )
      if (findCard !== -1) {
        c.cards.splice(findCard, 1)
      }
    })
    setBoard(newBoard)
    //gọi API xử lý
    deleteCardAPI(cardId).then(res => {
      //console.log(res)
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ minHeight:'100vh', backgroundColor:'black' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}

        createNewColumn = { createNewColumn }
        createNewCard = { createNewCard }
        moveColumns = { moveColumns }
        moveCardIntheSameColumn = { moveCardIntheSameColumn }
        moveCardToDifferentColumn = { moveCardToDifferentColumn }
        deleteColumnDetails = { deleteColumnDetails }
        deleteCard = { deleteCard }
      />
    </Container>
  )
}

export default Board