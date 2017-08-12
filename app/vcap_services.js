// app-bound services environment variables
module.exports = {

  // Get Object Store host from VCAP
  get_objstore_host: function () {
    if (process.env.VCAP_SERVICES) {
      var svc_info = JSON.parse(process.env.VCAP_SERVICES);
      for (var label in svc_info) {
        var svcs = svc_info['objectstore'];
        for (var index in svcs) {
          var host = svcs[index].credentials.host;
          return host;
        }
      }
    }
  },
  
  // Get Object Store access key id from VCAP
  get_objstore_accesskeyid: function () {
    if (process.env.VCAP_SERVICES) {
      var svc_info = JSON.parse(process.env.VCAP_SERVICES);
      for (var label in svc_info) {
        var svcs = svc_info['objectstore'];
        for (var index in svcs) {
          var akeyid = svcs[index].credentials.access_key_id;
          return akeyid;
        }
      }
    }
  },
  
  // Get Object Store secret access key from VCAP
  get_objstore_secretaccesskey: function () {
    if (process.env.VCAP_SERVICES) {
      var svc_info = JSON.parse(process.env.VCAP_SERVICES);
      for (var label in svc_info) {
        var svcs = svc_info['objectstore'];
        for (var index in svcs) {
          var secret = svcs[index].credentials.secret_access_key;
          return secret;
        }
      }
    }
  },
  
  // Get Object Store uri from VCAP
  get_objstore_url: function () {
    if (process.env.VCAP_SERVICES) {
      var svc_info = JSON.parse(process.env.VCAP_SERVICES);
      for (var label in svc_info) {
        var svcs = svc_info['objectstore'];
        for (var index in svcs) {
          var url = svcs[index].credentials.uri;
          return url;
        }
      }
    }
  },
  
  // Get Object Store host from VCAP
  get_objstore_bucket: function () {
    if (process.env.VCAP_SERVICES) {
      var svc_info = JSON.parse(process.env.VCAP_SERVICES);
      for (var label in svc_info) {
        var svcs = svc_info['objectstore'];
        for (var index in svcs) {
          var bkt = svcs[index].credentials.bucket;
          return bkt;
        }
      }
    }
  },
  
  // Get Object Store host from VCAP
  get_objstore_user: function () {
    if (process.env.VCAP_SERVICES) {
      var svc_info = JSON.parse(process.env.VCAP_SERVICES);
      for (var label in svc_info) {
        var svcs = svc_info['objectstore'];
        for (var index in svcs) {
          var usr = svcs[index].credentials.username;
          return usr;
        }
      }
    }
  }  
};
