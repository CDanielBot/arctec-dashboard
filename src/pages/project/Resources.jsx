import React from 'react'
import styled from 'styled-components'
import { Input, Button } from 'antd'

const Resources = ({ resources, setChanges, isEditing }) => {
  const resourceNameInput = Object.keys(resources).map(e => e)
  const resourceLinkInput = Object.values(resources).map(e => e)
  const numberOfInputs = Object.keys(resources).map(e => [])

  const handleChangeResourceName = (i, event) => {
    const values = [...resourceNameInput]
    values[i] = event.target.value

    saveResources(values, resourceLinkInput)
  }

  const handleChangeResourceLink = (i, event) => {
    const values = [...resourceLinkInput]
    values[i] = event.target.value

    saveResources(resourceNameInput, values)
  }

  const addInput = () => {
    const values = [...resourceNameInput]
    const values2 = [...resourceLinkInput]

    values.push([])
    values2.push([])

    saveResources(values, values2)
  }

  const handleRemove = i => {
    const values = [...resourceNameInput]
    const values2 = [...resourceLinkInput]

    values.splice(i, 1)
    values2.splice(i, 1)

    saveResources(values, values2)
  }

  const saveResources = (resourceNameInput, resourceLinkInput) => {
    var result = {}
    resourceNameInput.forEach((key, i) => (result[key] = resourceLinkInput[i]))

    setChanges({ resources: result })
  }

  const windowOpen = url => {
    if (!url.match(/^https?:\/\//i)) {
      url = 'http://' + url
    }
    return window.open(url)
  }

  if (Object.keys(resources).length) {
    return (
      <React.Fragment>
        {!isEditing && (
          <React.Fragment>
            {Object.keys(resources).map(resource => {
              return (
                <Resource key={resource}>
                  <ResourceName>{resource}:</ResourceName>
                  <ResourceLink onClick={() => windowOpen(resources[resource])}>
                    {resources[resource]}
                  </ResourceLink>
                </Resource>
              )
            })}
          </React.Fragment>
        )}
        {isEditing && (
          <React.Fragment>
            <div style={{ display: 'flex' }}>
              <Button icon="plus" style={{ marginBottom: '5px' }} onClick={addInput}>
                Add Resource
              </Button>
            </div>
            {numberOfInputs.map((field, idx) => {
              return (
                <div style={{ display: 'flex', alignItems: 'center' }} key={`${field}-${idx}`}>
                  <label>Name:</label>
                  <Input
                    value={resourceNameInput[idx]}
                    onChange={e => handleChangeResourceName(idx, e)}
                  />
                  <label>Link:</label>
                  <Input
                    value={resourceLinkInput[idx]}
                    onChange={e => handleChangeResourceLink(idx, e)}
                  />
                  <Button icon="close" type="danger" onClick={() => handleRemove(idx)}></Button>
                </div>
              )
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {isEditing && (
        <React.Fragment>
          <div style={{ display: 'flex' }}>
            <Button icon="plus" style={{ marginBottom: '5px' }} onClick={addInput}>
              Add Resource
            </Button>
          </div>
          {numberOfInputs.map((field, idx) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }} key={`${field}-${idx}`}>
                <label>Name:</label>
                <Input
                  value={resourceNameInput[idx]}
                  onChange={e => handleChangeResourceName(idx, e)}
                />
                <label>Link:</label>
                <Input
                  value={resourceLinkInput[idx]}
                  onChange={e => handleChangeResourceLink(idx, e)}
                />
                <Button icon="close" type="danger" onClick={() => handleRemove(idx)}></Button>
              </div>
            )
          })}
        </React.Fragment>
      )}
      {!isEditing && <p>No resources.</p>}
    </React.Fragment>
  )
}

export default Resources

const Resource = styled.div`
  display: flex;
  width: 500px;
  align-items: center;
`
const ResourceName = styled.p`
  padding-right: 5px;
  margin-bottom: 0px;
`

const ResourceLink = styled.p`
  margin-bottom: 0px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
