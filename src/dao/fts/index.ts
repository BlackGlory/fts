import { setObject } from './set-object.js'
import { deleteAllObjectsByNamespace } from './delete-all-objects-by-namespace.js'
import { deleteAllObjectsByBucket } from './delete-all-objects-by-bucket.js'
import { deleteObject } from './delete-object.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import { getAllBuckets } from './get-all-buckets.js'
import { getNamespaceStats } from './get-namespace-stats.js'
import { getBucketStats } from './get-bucket-stats.js'
import { query } from './query.js'
import { IFTSDAO } from './contract.js'

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
