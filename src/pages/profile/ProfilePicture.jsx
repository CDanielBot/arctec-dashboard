import React from 'react'
import styled from 'styled-components'
import { Upload, Icon, Avatar } from 'antd'

const ProfilePicture = ({ profilePicture, profilePictureFile, isEditing, setChanges }) => {
  const uploadPictureTest = async img => {
    setChanges({ profilePictureFile: img.file, profilePictureSrc: '' })
  }

  const deleteProfilePicture = async () => {
    setChanges({ profilePictureFile: null, profilePictureSrc: '' })
  }

  if (!isEditing) {
    return (
      <NoImageContainer>
        <AvatarAbsolute src={profilePicture} style={{ position: 'relative' }} />
      </NoImageContainer>
    )
  }

  return (
    <NoImageContainer>
      <UploadImage
        style={{ position: 'relative' }}
        name="avatar"
        showUploadList={false}
        listType="picture-card"
        customRequest={uploadPictureTest}
      >
        <UploadText>Upload</UploadText>

        <ImageContainer
          src={profilePictureFile ? URL.createObjectURL(profilePictureFile) : profilePicture}
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}
        />
      </UploadImage>

      <Icon type="close-circle" style={{ color: 'red' }} onClick={deleteProfilePicture} />
    </NoImageContainer>
  )
}

export default ProfilePicture

const ImageContainer = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
  max-height: 150px;
  max-width: 150px;
  object-fit: cover;
`

const NoImageContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 15px;
  display: flex;
  align-items: center;
`
const UploadImage = styled(Upload)`
  .ant-upload-select-picture-card {
    width: 150px;
    height: 150px;
    margin-bottom: 0px;
  }
`
const AvatarAbsolute = styled(Avatar).attrs({
  shape: 'square',
  size: 150,
  icon: 'user'
})`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 15px;

  img {
    object-fit: cover;
  }
`
const UploadText = styled.div`
  color: rgba(0, 0, 0, 0.8);
`
