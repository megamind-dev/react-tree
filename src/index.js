import ReactDOM from 'react-dom'
import React, { memo, useState } from 'react'
import { useSpring, a } from 'react-spring'
import { useMeasure, usePrevious } from './helpers'
import { Global, Frame, Title, Content, toggle } from './styles'
import * as Icons from './icons'
import Tree from './Tree'

const TreeView = memo(({ children, name, style, addNew = () => {}, parent = '', add = false, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`
    }
  })
  const Icon = Icons[`${children ? (isOpen ? 'Unchecked' : 'Checked') : 'Close'}SquareO`]
  return (
    <Frame>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      {!add && <Title style={style}>{name}</Title>}
      {add && <input type="text" onKeyDown={e => addNew(parent, e)} placeholder="add new label" />}

      <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </Frame>
  )
})

class Container extends React.Component {
  constructor(props) {
    super(props)

    let tree = new Tree()
    tree.add('Diseases')

    tree.add('Infiltration', 'Diseases')
    tree.add('Atelectasis', 'Infiltration')
    tree.add('Interstitial Pattern', 'Infiltration')

    tree.add('Consolidation', 'Diseases')
    tree.add('Lung Lesion', 'Diseases')
    tree.add('Mass', 'Lung Lesion')
    tree.add('Nodule', 'Lung Lesion')

    tree.add('Impression', 'Diseases')
    tree.add('Pneumonia', 'Impression')
    tree.add('Tuberculosis', 'Impression')

    this.state = {
      data: tree
    }
    this.addNew = this.addNew.bind(this)
  }

  addNew(parent, e) {
    if (e.key === 'Enter') {
      let { data } = this.state
      data.add(e.target.value, parent)
      this.setState({ data })
    }
  }

  displayNode(node) {
    let childs = []

    node.children.map(item => {
      childs.push(this.displayNode(item))
    })
    childs.push(<TreeView parent={node.data} addNew={this.addNew} name="Add New Menu" add={true} />)
    return <TreeView name={node.data}>{childs}</TreeView>
  }

  render() {
    const { data } = this.state
    return <>{this.displayNode(data.root)}</>
  }
}

const App = () => (
  <>
    <Global />
    <Container />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
