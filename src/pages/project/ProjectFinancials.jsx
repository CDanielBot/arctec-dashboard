import React, { useState } from 'react'
import styled from 'styled-components'
import { ProjectEndpoints } from 'api'
import { Button, Input, Upload, Icon, Card } from 'antd'
import { useTemporaryMessage } from 'hooks'
import moment from 'moment'

const { TextArea } = Input

const ProjectFinancials = ({ financials, project, onChange }) => {
  const [contractInput, setContractInput] = useState(null)

  const [extrasInput, setExtrasInput] = useState(null)
  const [extrasNotesInput, setExtrasNotesInput] = useState(null)

  const [invoiceInput, setInvoiceInput] = useState(null)
  const [invoiceNotesInput, setInvoiceNotesInput] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [message, showMessage, hideMessage] = useTemporaryMessage()

  const uploadDocument = async (e, type, input, notesInput) => {
    hideMessage()
    if (!input) {
      showMessage('Please type the name of document!')
      e.onError('error')
      return
    }

    if (type === 'contract') {
      let link = await ProjectEndpoints.uploadDocument(e.file, type, input, project.id)
      await ProjectEndpoints.updateProject(
        { financials: { ...financials, [type]: { [input]: link } } },
        project.id
      )
      onChange({ financials: { ...financials, [type]: { [input]: link } } })
      setContractInput(null)
    }

    if (type !== 'contract') {
      let link = await ProjectEndpoints.uploadDocument(e.file, type, input, project.id)
      await ProjectEndpoints.updateProject(
        {
          financials: {
            ...financials,
            [type]: { [input]: { link: link, date: new Date(), notes: notesInput } }
          }
        },
        project.id
      )
      onChange({
        financials: {
          ...financials,
          [type]: {
            ...financials[type],
            [input]: { link: link, date: new Date(), notes: notesInput }
          }
        }
      })
      setExtrasInput(null)
      setInvoiceInput(null)
    }

    e.onSuccess('ok')
  }

  const handleRemove = async (e, type) => {
    await ProjectEndpoints.deleteDocument(e, project.id, type)

    const newDocuments = { ...financials }
    delete newDocuments[type][e]

    await ProjectEndpoints.updateDocuments({ financials: { ...newDocuments } }, project.id)
    onChange({ financials: { ...newDocuments } })
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
            <SectionTitle>Contract</SectionTitle>
            <ContractSection>
              {!Object.keys(financials.contract).length && (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '5px' }}>Name:</label>
                    <Input
                      onChange={e => setContractInput(e.target.value)}
                      style={{ width: '300px', marginRight: '5px' }}
                    />

                    <Upload customRequest={e => uploadDocument(e, 'contract', contractInput)}>
                      <Button>
                        <Icon type="upload" /> Click to Add
                      </Button>
                    </Upload>
                  </div>
                  <Error>{message}</Error>
                </React.Fragment>
              )}
              {Object.keys(financials.contract).map(document => {
                return (
                  <Resource key={document}>
                    <DocumentTitle>{document}:</DocumentTitle>
                    <Button
                      onClick={() =>
                        ProjectEndpoints.downloadDocument(financials[document], document)
                      }
                      style={{ marginRight: '5px' }}
                    >
                      Download {document}
                    </Button>
                    <Button
                      icon="close"
                      type="danger"
                      onClick={() => handleRemove(document, 'contract')}
                      style={{ marginRight: '5px' }}
                    ></Button>
                  </Resource>
                )
              })}
            </ContractSection>

            <SectionTitle>Contract Extrass</SectionTitle>
            <ContractExtrasSection>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card
                  title="Title"
                  extra={
                    <React.Fragment>
                      <Input
                        onChange={e => setExtrasInput(e.target.value)}
                        style={{ width: '300px', marginRight: '5px', marginLeft: '5px' }}
                      />
                      <Upload
                        customRequest={e =>
                          uploadDocument(e, 'extras', extrasInput, extrasNotesInput)
                        }
                      >
                        <Button>
                          <Icon type="upload" /> Click to Add
                        </Button>
                      </Upload>
                    </React.Fragment>
                  }
                >
                  <p>Notes:</p>
                  <TextArea onChange={e => setExtrasNotesInput(e.target.value)} />
                </Card>
              </div>
              <Error>{message}</Error>
              {Object.keys(financials.extras).map(document => {
                return (
                  <Resource key={document}>
                    <DocumentTitle>{document}:</DocumentTitle>
                    <Button
                      onClick={() =>
                        ProjectEndpoints.downloadDocument(financials[document].link, document)
                      }
                      style={{ marginRight: '5px' }}
                    >
                      Download {document}
                    </Button>
                    <Button
                      icon="close"
                      type="danger"
                      onClick={() => handleRemove(document, 'extras')}
                      style={{ marginRight: '5px' }}
                    ></Button>
                  </Resource>
                )
              })}
            </ContractExtrasSection>

            <SectionTitle>Client Invoices</SectionTitle>
            <ClientInvoicesSection>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card
                  title="Title"
                  extra={
                    <React.Fragment>
                      <Input
                        onChange={e => setInvoiceInput(e.target.value)}
                        style={{ width: '300px', marginRight: '5px', marginLeft: '5px' }}
                      />
                      <Upload
                        customRequest={e =>
                          uploadDocument(e, 'invoices', invoiceInput, invoiceNotesInput)
                        }
                      >
                        <Button>
                          <Icon type="upload" /> Click to Add
                        </Button>
                      </Upload>
                    </React.Fragment>
                  }
                >
                  <p>Notes:</p>
                  <TextArea onChange={e => setInvoiceNotesInput(e.target.value)} />
                </Card>
              </div>
              <Error>{message}</Error>
              {Object.keys(financials.invoices).map(document => {
                return (
                  <Resource key={document}>
                    <DocumentTitle>{document}:</DocumentTitle>
                    <Button
                      onClick={() =>
                        ProjectEndpoints.downloadDocument(financials[document].link, document)
                      }
                      style={{ marginRight: '5px' }}
                    >
                      Download {document}
                    </Button>
                    <Button
                      icon="close"
                      type="danger"
                      onClick={() => handleRemove(document, 'invoices')}
                      style={{ marginRight: '5px' }}
                    ></Button>
                  </Resource>
                )
              })}
            </ClientInvoicesSection>
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

      <SectionTitle>Contract</SectionTitle>
      <ContractSection>
        {!Object.keys(financials.contract).length && <p>No contract.</p>}

        {Object.keys(financials.contract).map(document => {
          return (
            <Resource key={document}>
              <DocumentTitle>{document}:</DocumentTitle>

              <Button
                onClick={() => ProjectEndpoints.downloadDocument(financials.contract[document])}
              >
                Download {document}
              </Button>
            </Resource>
          )
        })}
      </ContractSection>

      <SectionTitle>Contract Extras</SectionTitle>
      <ContractExtrasSection>
        {!Object.keys(financials.extras).length && <p>No extrasses.</p>}

        {Object.keys(financials.extras).map(document => {
          return (
            <Card
              style={{ marginBottom: '10px' }}
              key={document}
              title={document}
              extra={
                <React.Fragment>
                  <label style={{ marginRight: '30px' }}>
                    {moment.unix(financials.extras[document].date.seconds).format('DD-MMM-YYYY')}
                  </label>
                  <Button
                    onClick={() =>
                      ProjectEndpoints.downloadDocument(financials.extras[document].link)
                    }
                  >
                    Download {document}
                  </Button>
                </React.Fragment>
              }
            >
              <p>{financials.extras[document].notes}</p>
            </Card>
          )
        })}
      </ContractExtrasSection>

      <ClientInvoicesSection>
        <SectionTitle>Client Invoices</SectionTitle>
        {!Object.keys(financials.invoices).length && <p>No client invoices.</p>}

        {Object.keys(financials.invoices).map(document => {
          return (
            <Card
              style={{ marginBottom: '10px' }}
              key={document}
              title={document}
              extra={
                <React.Fragment>
                  <label style={{ marginRight: '30px' }}>
                    {moment.unix(financials.invoices[document].date.seconds).format('DD-MMM-YYYY')}
                  </label>
                  <Button
                    onClick={() =>
                      ProjectEndpoints.downloadDocument(financials.invoices[document].link)
                    }
                  >
                    Download {document}
                  </Button>
                </React.Fragment>
              }
            >
              <p>{financials.invoices[document].notes}</p>
            </Card>
          )
        })}
      </ClientInvoicesSection>
    </Page>
  )
}

export default ProjectFinancials
const Page = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-left: 30px;
`

const SectionTitle = styled.label`
  font-weight: bold;
  font-size: 25px;
`

const ContractSection = styled.div`
  padding-bottom: 10px;
`
const ContractExtrasSection = styled.div`
  padding-bottom: 10px;
`
const ClientInvoicesSection = styled.div`
  padding-bottom: 10px;
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
