import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useMemo } from 'react';

import { useQuery } from '@/hooks/useQuery';
import { isOnServerSide } from '@/utils/env';
const genHref = ({ hash, replace, url, prevQuery = {}, query = {} }) => {
  let href = qs.stringifyUrl({
    query: replace ? query : { ...prevQuery, ...query },
    url
  })

  if (!isOnServerSide && hash) {
    href = [href, hash || location?.hash?.slice(1)].filter(Boolean).join("#")
  }

  return href
}

export const useQueryRoute = () => {
  const router = useRouter()
  const prevQuery = useQuery()

  return useMemo(
      () => ({
        push: (url, options = {}) => {
          return router.push(genHref({ prevQuery, url, ...options }))
        },
        replace: (url, options = {}) => {
          return router.replace(genHref({ prevQuery, url, ...options }))
        }
      }),
      [prevQuery]
  )
}

