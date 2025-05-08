import { ImplementationOf } from 'delight-rpc'
import { IAPI } from '@src/contract.js'
import { clearBucketsByNamespace } from './clear-buckets-by-namespace.js'
import { clearDocumentsByBucket } from './clear-documents-by-bucket.js'
import { getAllBuckets } from './get-all-buckets.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import { getBucketStats } from './get-bucket-stats.js'
import { getNamespaceStats } from './get-namespace-stats.js'
import { queryDocuments } from './query-documents.js'
import { removeDocument } from './remove-document.js'
import { setDocument } from './set-document.js'

export const API: ImplementationOf<IAPI> = {
  getNamespaceStats
, getBucketStats
, getAllNamespaces
, getAllBuckets
, setDocument
, removeDocument
, clearBucketsByNamespace
, clearDocumentsByBucket
, queryDocuments: queryDocuments as ImplementationOf<IAPI>['queryDocuments']
}
