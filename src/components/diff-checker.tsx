import { useCallback, useEffect, useState } from 'react'
import { diffLines, Change } from 'diff'
import toast from 'react-hot-toast';

import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function DiffCheckerComponent(
  props: Readonly<{
    jsonMode: boolean,
    text1: string,
    text2: string
  }>
) {
  const [text1Data, setText1Data] = useState(props.text1)
  const [text2Data, setText2Data] = useState(props.text2)
  const [diffResult, setDiffResult] = useState<Change[]>([])

  const performDiff = useCallback(() => {
    try {
      const diff = diffLines(text1Data, text2Data)

      if(props.jsonMode) {
          let better_text1: Record<string, unknown> = JSON.parse(text1Data)
          better_text1 = Object.keys(better_text1).sort((a, b) => a.localeCompare(b)).reduce((acc: Record<string, unknown>, key: string) => {
            acc[key] = better_text1[key]
            return acc
          }, {})

          let better_text2: Record<string, unknown> = JSON.parse(text2Data)
          better_text2 = Object.keys(better_text2).sort((a, b) => a.localeCompare(b)).reduce((acc: Record<string, unknown>, key: string) => {
            acc[key] = better_text2[key]
            return acc
          }, {})

          const diff = diffLines(JSON.stringify(better_text1, null, 2), JSON.stringify(better_text2, null, 2), {

          })
          setDiffResult(diff)

          toast.success('Diff completed', {
            duration: 3000
          })

          return
        }
      else {
        setDiffResult(diff)
        
        toast.success('Diff completed', {
          duration: 3000
        })
      }
    }
    catch {
      console.error('Error parsing JSON')

      toast.error('Error parsing JSON', {
        duration: 3000
      })
    }
  }, [text1Data, text2Data, props.jsonMode])

  useEffect(() => {
    if(props.text1 && props.text2) {
      performDiff()
    }
  }, [performDiff, props.text1, props.text2])

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Diff Checker 📐 | by <a href='https://github.com/bravo68web'>@bravo68web</a></h1>
      <Button onClick={() => {
        const url = new URL(window.location.href)
        url.searchParams.set('jsonMode', String(!props.jsonMode))
        window.location.href = url.toString()
      }} className="mb-4">
        {props.jsonMode ? 'Toggle Text Mode' : 'Toggle JSON Mode'}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="text1Data" className="block text-sm font-medium text-gray-700 mb-2">
            Original Text
          </label>
          <Textarea
            id="text1Data"
            value={text1Data}
            onChange={(e) => setText1Data(e.target.value)}
            rows={10}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="text2" className="block text-sm font-medium text-gray-700 mb-2">
            Modified Text
          </label>
          <Textarea
            id="text2"
            value={text2Data}
            onChange={(e) => setText2Data(e.target.value)}
            rows={10}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <Button onClick={performDiff} className="mb-4">
        Compare Texts
      </Button>

      {/* Show only when diffResult is present */}
      {diffResult.length > 0 && (
        <>
          <div className="bg-gray-100 p-4 rounded overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Diff Result</h2>
          <pre className="whitespace-pre-wrap">
            {diffResult.map((part, index) => {
              let color = ''
              if (part.added) {
                color = 'bg-green-200'
              } else if (part.removed) {
                color = 'bg-red-200'
              }
              return (
                <span key={`${part.value}-${index}`} className={color}>
                  {part.value}
                </span>
              )
            })}
          </pre>
        </div>
        <div className="mt-4">
          <Button onClick={() => {
            const url = new URL(window.location.href)
            // remove the search params
            url.searchParams.delete('jsonMode')
            url.searchParams.delete('text1')
            url.searchParams.delete('text2')
            url.searchParams.set('text1', text1Data)
            url.searchParams.set('text2', text2Data)

            // Copy the URL to the clipboard
            navigator.clipboard.writeText(url.toString())

            toast.success('URL copied to clipboard', {
              duration: 3000,
              icon: '📋',
              position: 'top-right',
              ariaProps: {
                role: 'status',
                'aria-live': 'polite'
              }
            })
          }}>
            Share this diff
          </Button>

          <Button onClick={() => {
            const url = new URL(window.location.href)
            url.searchParams.delete('jsonMode')
            url.searchParams.delete('text1')
            url.searchParams.delete('text2')
            window.location.href = url.toString()
          }} className="ml-2">
            Reset
          </Button>
        </div>
      </>
      )}
    </div>
  )
}