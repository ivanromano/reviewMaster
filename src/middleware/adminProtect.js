export default defineNuxtRouteMiddleware( async() => {
  const user = getUser()
  if (!user || !user.is_admin) {
    console.log(user.is_admin)
    return abortNavigation()
  }

})