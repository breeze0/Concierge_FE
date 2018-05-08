<script>
  const server = 'http://www.axuzz.cn';
  const expire = 1000 * 60 * 60 * 36;
  const routers = {
    'login': '/login',
    'projects': '/admin/projects',
    'projects_new': '/admin/projects/new',
    'projects_edit': '/admin/projects/edit/',
    'reservations_details': '/admin/projects/reservation/'
  };
  const requestUrls = {
    'code': server + '/code',
    'login': server + '/login',
    'projects': server + '/projects',
    'project': server + '/projects/',
    'covers': server + '/covers',
    'image': server + '/image'
  }
  const httpStateInfo = {
    'invalid_token': 'Invalid Token'
  }
  export default {
    server,
    expire,
    routers,
    requestUrls,
    httpStateInfo
  }
</script>