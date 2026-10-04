function ApiError({ message }) {
  return (
    <div className="api-error" role="alert">
      {message}
    </div>
  )
}

export default ApiError
