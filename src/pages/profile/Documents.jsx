import React, { useState } from 'react'
import styled from 'styled-components'
import { UserEndpoints } from 'api'
import { Button, Input, Upload, Icon } from 'antd'
import { useTemporaryMessage } from 'hooks'

const Documents = ({ documents, employee, onChange }) => {
  const [documentsInput, setDocumentsInput] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [message, showMessage, hideMessage] = useTemporaryMessage()
  const [file, setFile] = useState()

  const uploadDocument = async e => {
    hideMessage()
    if (!documentsInput) {
      showMessage('Please type the name of document!')
      e.onError('error')
      return
    }

    let link = await UserEndpoints.uploadDocument(documentsInput, employee.id, e.file)
    await UserEndpoints.updateUser(
      { documents: { ...documents, [documentsInput]: link } },
      employee.id
    )
    onChange({ documents: { ...documents, [documentsInput]: link } })

    e.onSuccess('ok')
    setDocumentsInput(null)
  }

  const setFileList = fileList => {
    const newFileList = [fileList[fileList.length - 1]]
    setFile(newFileList)
  }

  const handleRemove = async e => {
    await UserEndpoints.deleteDocument(e, employee.id)

    const newDocuments = { ...documents }
    delete newDocuments[e]

    await UserEndpoints.updateDocument({ documents: { ...newDocuments } }, employee.id)
    onChange({ documents: { ...newDocuments } })
  }

  if (isEditing) {
    return (
      <Page>
        <EditSection>
          <EditButton
            icon="edit"
            props={isEditing ? 1 : 0}
            onClick={() => setIsEditing(!isEditing)}
          />
        </EditSection>

        {isEditing && (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ marginRight: '5px' }}>Name:</label>
              <Input
                onChange={e => setDocumentsInput(e.target.value)}
                style={{ width: '300px', marginRight: '5px' }}
              />

              <Upload
                customRequest={uploadDocument}
                onChange={e => setFileList(e.fileList)}
                fileList={file}
              >
                <Button>
                  <Icon type="upload" /> Click to Add
                </Button>
              </Upload>
            </div>
            <Error>{message}</Error>
            {Object.keys(documents).map(document => {
              return (
                <Resource key={document}>
                  <DocumentTitle>{document}:</DocumentTitle>
                  <Button
                    onClick={() => UserEndpoints.downloadDocument(documents[document])}
                    style={{ marginRight: '5px' }}
                  >
                    Download {document}
                  </Button>
                  <Button
                    icon="close"
                    type="danger"
                    onClick={() => handleRemove(document)}
                    style={{ marginRight: '5px' }}
                  ></Button>
                </Resource>
              )
            })}
          </React.Fragment>
        )}
      </Page>
    )
  }

  return (
    <Page>
      <EditSection>
        <EditButton
          icon="edit"
          props={isEditing ? 1 : 0}
          onClick={() => setIsEditing(!isEditing)}
        />
      </EditSection>

      {!Object.keys(documents).length && <p>No documents.</p>}

      {Object.keys(documents).map(document => {
        return (
          <Resource key={document}>
            <DocumentTitle>{document}:</DocumentTitle>

            <Button onClick={() => UserEndpoints.downloadDocument(documents[document])}>
              Download {document}
            </Button>
          </Resource>
        )
      })}
    </Page>
  )
}

export default Documents
const Page = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
`

const Resource = styled.div`
  display: flex;
  width: 500px;
  align-items: center;
  height: 50px;
`
const DocumentTitle = styled.label`
  padding-right: 5px;
  font-weight: bold;
  font-size: 15px;
`

const EditSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 45px;
`

const EditButton = styled(Button)`
  color: ${({ props }) => (props ? '#096dd9' : '')};
  border-color: ${({ props }) => (props ? '#096dd9' : '')};
  :hover {
    cursor: pointer;
    color: #096dd9;
  }
  font-size: 10px;
  height: 25px;
  width: 25px;
  margin-left: 25px;
`
const Error = styled.div`
  color: red;
`
