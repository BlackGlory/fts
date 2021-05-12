import { setObject } from './set-object'
import { deleteAllObjectsByNamespace } from './delete-all-objects-by-namespace'
import { deleteAllObjectsByBucket } from './delete-all-objects-by-bucket'
import { deleteObject } from './delete-object'
import { getAllNamespaces } from './get-all-namespaces'
import { getAllBuckets } from './get-all-buckets'
import { getNamespaceStats } from './get-namespace-stats'
import { getBucketStats } from './get-bucket-stats'
import { query } from './query'

export const FTSDAO: IFTSDAO = {
  setObject
, deleteAllObjectsByNamespace
, deleteAllObjectsByBucket
, deleteObject
, getAllNamespaces
, getAllBuckets
, getBucketStats
, getNamespaceStats
, query
}
