import { setObject } from './set-object'
import { deleteObject } from './delete-object'
import { deleteAllObjects } from './delete-all-objects'
import { stats } from './stats'
import { query } from './query'
import { getAllNamespaces } from './get-all-namespaces'

export const FTSDAO: IFTSDAO = {
  setObject
, deleteObject
, deleteAllObjects
, stats
, query
, getAllNamespaces
}