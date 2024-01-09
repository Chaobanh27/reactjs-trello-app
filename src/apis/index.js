/* eslint-disable no-console */
import axios from 'axios'
import { API_ROOT } from '../utils/constants'

export const fetchBoardDetailsAPI = async (boardId) => {
  const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  //Luu y : tat ca function goi API voi axios chi co request va lay data luon ma khong co try/catch hay then/catch de bat loi
  //boi vi nhu vay la khong can thiet no se gay ra du thua code catch loi qua nhieu
  //chung ta chi can catch loi tap trung tai mot noi bang cach dung Interceptors trong axios
  return request.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //console.log(boardId)
  return request.data
}
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return request.data
}

//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return request.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const request = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return request.data
}


//Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
export const deleteCardAPI = async (cardId) => {
  const request = await axios.delete(`${API_ROOT}/v1/cards/${cardId}`)
  return request.data
}
