<script>
  const server = 'http://192.168.31.208';
  const expire = 1000 * 60 * 60 * 36;
  const routers = {
    'login': '/login',
    'projects': '/admin/projects',
    'projects_new': '/admin/projects/new',
    'projects_edit': '/admin/projects/edit/'
  };
  const requestUrls = {
    'code': server + '/code',
    'login': server + '/login',
    'projects': server + '/projects',
    'projects_id': server + '/projects/',
    'covers': server + '/covers',
    'image': server + '/image'
  }
  export default {
    server,
    expire,
    routers,
    requestUrls
  }
</script>