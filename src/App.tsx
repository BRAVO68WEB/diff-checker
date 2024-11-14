import { DiffCheckerComponent } from './components/diff-checker'

const App = () => {
  const current_url = new URL(window.location.href)
  const jsonMode = current_url.searchParams.get('jsonMode') === 'true'
  const text1 = current_url.searchParams.get('text1') ?? ''
  const text2 = current_url.searchParams.get('text2') ?? ''

  return (
    <DiffCheckerComponent jsonMode={jsonMode} text1={text1} text2={text2} />
  )
}

export default App
