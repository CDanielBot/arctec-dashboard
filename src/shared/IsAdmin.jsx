import { connect } from 'react-redux'

const IsAdmin = ({ profile, children }) => {
  if (profile.role === 'admin') return children
  return null
}

const mapStateToProps = state => ({ profile: state.auth.profile })

export default connect(mapStateToProps)(IsAdmin)
