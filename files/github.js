const github = {
  CLIENT_ID: "32725b5fad841bcfafa6",
  CLIENT_SECRET: "b4e7f258cb2eff95cbc42f20419561cc48d3649d",
  syncStart: () => {
    let authWin = new BrowserWindow({
      width: 800,
      height: 600,
      title: "Sign in to Github · Github",
      parent: CURRENT_WINDOW,
      modal: true,
      backgroundColor:
        document.getElementById("control").innerHTML == lighttheme
          ? "#F8F8F8"
          : "#1A1C1D",
      maximizable: false,
      minimizable: false,
    });
    authWin.loadURL(
      `https://github.com/login/oauth/authorize?client_id=${github.CLIENT_ID}&scope=gist`
    );
    //authWin.webContents.openDevTools();
    authWin.webContents.once("did-finish-load", () => {
      authWin.webContents.insertCSS(
        $("#main_color_control").html() +
          $("#control").html() +
          "*{color:var(--active)}a:any-link{color:var(--main)}::selection{background:var(--selection)}.session-authentication,.logged-in.bg-gray-light{background-color:var(--darkback) !important}.highlight{background:none !important;color:var(--active) !important}.permission-title{color:var(--active) !important}.Box,.Box.bg-gray-light.px-4.py-3.mt-3.text-small.text-gray.clearfix,.auth-form-body{background-color:var(--background) !important;box-shadow:#0003 0 10px 30px;border:none !important}.auth-form-body{margin:0;position:fixed;min-width:320px;top:50vh;left:50vw;transform:translate(-50%,-60%)}.CircleBadge{position:relative;width:60px !important;height:60px !important;overflow:hidden;border-radius:20% !important;box-shadow:#0003 0 10px 20px !important;margin-bottom:20px;background:none !important}.CircleBadge img{max-width:none !important;max-height:none !important;height:100% !important;width:100% !important;position:absolute}.auth-form-body .input-block{box-shadow:#0002 0 3px 15px;background:rgba(255,255,255,calc((var(--darker) - .65) * 4));border:0;border-radius:3px;padding:5px;caret-color:var(--main);font-size:17px;border-bottom:#0000 3px solid;transition:all .3s;color:var(--active);height:auto}.auth-form-body .input-block:focus{border-bottom:var(--main) 3px solid;box-shadow:#0002 0 10px 15px}.label-link,.login-callout.mt-3{display:none !important}.btn-primary,.btn-primary:focus{background:var(--main) !important;border:none !important;border-radius:3px !important;box-shadow:#0002 0 3px 15px !important;font-size:16px !important;height:35px !important;transition:all .2s !important;cursor:default}.btn-primary:hover{filter:brightness(var(--lighter)) !important;box-shadow:#0002 0 10px 15px !important;transition:all .2s !important}.btn-primary:active{filter:brightness(var(--darker)) !important;box-shadow:#0002 0 0 3px !important;transition:all .1s !important}.create-account-callout,.footer,.header,.session-authentication .auth-form-header h1,.permission-help a,.text-small.text-gray.mb-0.text-center,button.btn.width-full.mr-2.ws-normal:nth-child(1),.muted-link.text-small{display:none}.flash.flash-full.flash-error{background:#e003;font-size:16px;padding:5px 10px;position:fixed;bottom:30px}.DashedConnection:before{border:0}.permission-help p{user-select:none}.permission-help p:after{content:' Clear Writer uses gists to store your cloud backup.'}::-webkit-scrollbar{width:7px;height:7px;background-color:#0000}::-webkit-scrollbar-track{background-color:#0000}::-webkit-scrollbar-thumb{background-color:#8885}::-webkit-scrollbar-thumb:hover{background-color:#8888}::-webkit-scrollbar-thumb:active{background-color:#888A}"
      );
    });
    authWin.webContents.addListener("did-navigate", (_event, url) => {
      authWin.webContents.insertCSS(
        $("#main_color_control").html() +
          $("#control").html() +
          "*{color:var(--active)}a:any-link{color:var(--main)}::selection{background:var(--selection)}.session-authentication,.logged-in.bg-gray-light{background-color:var(--darkback) !important}.highlight{background:none !important;color:var(--active) !important}.permission-title{color:var(--active) !important}.Box,.Box.bg-gray-light.px-4.py-3.mt-3.text-small.text-gray.clearfix,.auth-form-body{background-color:var(--background) !important;box-shadow:#0003 0 10px 30px;border:none !important}.auth-form-body{margin:0;position:fixed;min-width:320px;top:50vh;left:50vw;transform:translate(-50%,-60%)}.CircleBadge{position:relative;width:60px !important;height:60px !important;overflow:hidden;border-radius:20% !important;box-shadow:#0003 0 10px 20px !important;margin-bottom:20px;background:none !important}.CircleBadge img{max-width:none !important;max-height:none !important;height:100% !important;width:100% !important;position:absolute}.auth-form-body .input-block{box-shadow:#0002 0 3px 15px;background:rgba(255,255,255,calc((var(--darker) - .65) * 4));border:0;border-radius:3px;padding:5px;caret-color:var(--main);font-size:17px;border-bottom:#0000 3px solid;transition:all .3s;color:var(--active);height:auto}.auth-form-body .input-block:focus{border-bottom:var(--main) 3px solid;box-shadow:#0002 0 10px 15px}.label-link,.login-callout.mt-3{display:none !important}.btn-primary,.btn-primary:focus{background:var(--main) !important;border:none !important;border-radius:3px !important;box-shadow:#0002 0 3px 15px !important;font-size:16px !important;height:35px !important;transition:all .2s !important;cursor:default}.btn-primary:hover{filter:brightness(var(--lighter)) !important;box-shadow:#0002 0 10px 15px !important;transition:all .2s !important}.btn-primary:active{filter:brightness(var(--darker)) !important;box-shadow:#0002 0 0 3px !important;transition:all .1s !important}.create-account-callout,.footer,.header,.session-authentication .auth-form-header h1,.permission-help a,.text-small.text-gray.mb-0.text-center,button.btn.width-full.mr-2.ws-normal:nth-child(1),.muted-link.text-small{display:none}.flash.flash-full.flash-error{background:#e003;font-size:16px;padding:5px 10px;position:fixed;bottom:30px}.DashedConnection:before{border:0}.permission-help p{user-select:none}.permission-help p:after{content:' Clear Writer uses gists to store your cloud backup.'}::-webkit-scrollbar{width:7px;height:7px;background-color:#0000}::-webkit-scrollbar-track{background-color:#0000}::-webkit-scrollbar-thumb{background-color:#8885}::-webkit-scrollbar-thumb:hover{background-color:#8888}::-webkit-scrollbar-thumb:active{background-color:#888A}"
      );
      //authWin.webContents.openDevTools();
      if (!url.match(/\/callback.html/)) return;
      let code = url;
      let start = code.indexOf("?code=") + 6;
      let end =
        code.indexOf("&state") == -1 ? code.length : code.indexOf("&state");
      code = code.substring(start, end);
      $.ajax({
        type: "POST",
        url: "https://github.com/login/oauth/access_token",
        data: {
          client_id: github.CLIENT_ID,
          client_secret: github.CLIENT_SECRET,
          code: code,
        },
        success: (callback) => {
          let arr = callback.split("&");
          arr = arr[0].split("=");
          let token = arr[1];
          store.set("token", token);
          octokit = new Octokit({ auth: token });
          octokit.request("GET /users").then((data) => {
            store.set("username", data.login);
            store.set("uid", data.id);
            syncDiv.className = "connected";
            document.getElementById(
              "avartar"
            ).src = `https://avatars0.githubusercontent.com/u/${store.store.uid}?s=40&v=4`;
            document.getElementById("username_span").innerHTML =
              store.store.username;
            authWin.close();
          });
        },
      });
    });
  },
  signOut: () => {
    store.delete("uid");
    store.delete("token");
    store.delete("username");
    syncDiv.className = "unconnected";
    deleteCookie("github");
  },
  exportDataGist: async () => {
    //tips(COLLECTING_DATA + "...");
    let day = new Date();
    let date =
      day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    let result = {};
    result["clear-writer-backup.json"] = { content: exportData(true) };
    let file_list = `# ${FILE_LIST_TITLE}\n\n${THIS_IS_A_BACKUP.replace(
      "${VERSION}",
      VERSION
    ).replace("${date}", date)}\n\n`;
    for (let i = 0, l = nameArray.length; i < l; i++) {
      file_list += `- ${nameArray[i]}\n`;
    }
    result["ClearWriter_backup.md"] = { content: file_list };

    tips(SENDING_DATA + "...");

    try {
      await octokit.request("POST /gists", {
        files: result,
        description: `Clear_Writer_Backup_${date}`,
        public: false,
      });

      tips(SEND_SUCCEEDED);
    } catch {
      tips(NET_ERR);
    }
  },
  importDataGist: async () => {
    tips(PULLING_LIST + "...");
    try {
      let arr = (await octokit.request("GET /gists")).data;
      let l = arr.length;
      let string = '<ul id="import_list">';
      for (let i = 0; i < l; i++) {
        if (!arr[i].files["clear-writer-backup.json"]) continue;
        string += `<li onclick=github.chooseGist('${arr[i].id}')>${arr[
          i
        ].description.replace(/^Clear_Writer_Backup_/, "")}</li>`;
      }
      string += "</ul>";
      msgbox(CHOOSE_BACKUP, string, 35, 25, false, 1001);
    } catch {
      tips(NET_ERR);
    }
  },
  chooseGist: async (id) => {
    close_msgbox();
    tips(DOWNLOADING_DATA + "...");
    try {
      let gist = await octokit.request(`GET /gists/${id}`, {
        gist_id: id,
      });
      tips(PARSING_DATA + "...");
      importData(gist.data.files["clear-writer-backup.json"].content);
    } catch {
      tips(NET_ERR);
    }
  },
};

const gitee = {
  CLIENT_ID: "01bc15ae6554bd068da2a7de0e808ccb65a09f0415b563ec6d1f888bb4ac9a0a",
  REDIRECT_URL: "https%3A%2F%2Fclearwriter.gitee.io%2Fcallback.html",
  CLIENT_SECRET:
    "2576fa047075ef70e808d9720d8161a32ad2e9d64d238c91d70ac8d9f15d1b50",
  API_URL: "https://gitee.com/api/v5",
  syncStart: () => {
    let authWin = new BrowserWindow({
      width: 800,
      height: 600,
      title: "登录 - 码云 Gitee.com",
      parent: CURRENT_WINDOW,
      modal: true,
      backgroundColor:
        document.getElementById("control").innerHTML == lighttheme
          ? "#F8F8F8"
          : "#1A1C1D",
      maximizable: false,
      minimizable: false,
    });
    authWin.loadURL(
      `https://gitee.com/oauth/authorize?client_id=${gitee.CLIENT_ID}&redirect_uri=${gitee.REDIRECT_URL}&response_type=code`
    );
    //authWin.webContents.openDevTools();
    // authWin.webContents.once("did-finish-load", () => {
    //   authWin.webContents.insertCSS(
    //     $("#main_color_control").html() +
    //       $("#control").html() +
    //       "*{color:var(--active)}a:any-link{color:var(--main)}::selection{background:var(--selection)}.session-authentication,.logged-in.bg-gray-light{background-color:var(--darkback) !important}.highlight{background:none !important;color:var(--active) !important}.permission-title{color:var(--active) !important}.Box,.Box.bg-gray-light.px-4.py-3.mt-3.text-small.text-gray.clearfix,.auth-form-body{background-color:var(--background) !important;box-shadow:#0003 0 10px 30px;border:none !important}.auth-form-body{margin:0;position:fixed;min-width:320px;top:50vh;left:50vw;transform:translate(-50%,-60%)}.CircleBadge{position:relative;width:60px !important;height:60px !important;overflow:hidden;border-radius:20% !important;box-shadow:#0003 0 10px 20px !important;margin-bottom:20px;background:none !important}.CircleBadge img{max-width:none !important;max-height:none !important;height:100% !important;width:100% !important;position:absolute}.auth-form-body .input-block{box-shadow:#0002 0 3px 15px;background:rgba(255,255,255,calc((var(--darker) - .65) * 4));border:0;border-radius:3px;padding:5px;caret-color:var(--main);font-size:17px;border-bottom:#0000 3px solid;transition:all .3s;color:var(--active);height:auto}.auth-form-body .input-block:focus,.auth-form-body .input-block:hover{border-bottom:var(--main) 3px solid;box-shadow:#0002 0 10px 15px}.label-link{display:none !important}.btn-primary,.btn-primary:focus{background:var(--main) !important;border:none !important;border-radius:3px !important;box-shadow:#0002 0 3px 15px !important;font-size:16px !important;height:35px !important;transition:all .2s !important;cursor:default}.btn-primary:hover{filter:brightness(var(--lighter)) !important;box-shadow:#0002 0 10px 15px !important;transition:all .2s !important}.btn-primary:active{filter:brightness(var(--darker)) !important;box-shadow:#0002 0 0 3px !important;transition:all .1s !important}.create-account-callout,.footer,.header,.session-authentication .auth-form-header h1,.permission-help a,.text-small.text-gray.mb-0.text-center,button.btn.width-full.mr-2.ws-normal:nth-child(1),.muted-link.text-small{display:none}.flash.flash-full.flash-error{background:#e003;font-size:16px;padding:5px 10px;position:fixed;bottom:30px}.DashedConnection:before{border:0}.permission-help p{user-select:none}.permission-help p:after{content:' Clear Writer uses gists to store your cloud backup.'}::-webkit-scrollbar{width:7px;height:7px;background-color:#0000}::-webkit-scrollbar-track{background-color:#0000}::-webkit-scrollbar-thumb{background-color:#8885}::-webkit-scrollbar-thumb:hover{background-color:#8888}::-webkit-scrollbar-thumb:active{background-color:#888A}"
    //   );
    // });
    authWin.webContents.addListener("did-navigate", (_event, url) => {
      // authWin.webContents.insertCSS(
      //   $("#main_color_control").html() +
      //     $("#control").html() +
      //     "*{color:var(--active)}a:any-link{color:var(--main)}::selection{background:var(--selection)}.session-authentication,.logged-in.bg-gray-light{background-color:var(--darkback) !important}.highlight{background:none !important;color:var(--active) !important}.permission-title{color:var(--active) !important}.Box,.Box.bg-gray-light.px-4.py-3.mt-3.text-small.text-gray.clearfix,.auth-form-body{background-color:var(--background) !important;box-shadow:#0003 0 10px 30px;border:none !important}.auth-form-body{margin:0;position:fixed;min-width:320px;top:50vh;left:50vw;transform:translate(-50%,-60%)}.CircleBadge{position:relative;width:60px !important;height:60px !important;overflow:hidden;border-radius:20% !important;box-shadow:#0003 0 10px 20px !important;margin-bottom:20px;background:none !important}.CircleBadge img{max-width:none !important;max-height:none !important;height:100% !important;width:100% !important;position:absolute}.auth-form-body .input-block{box-shadow:#0002 0 3px 15px;background:rgba(255,255,255,calc((var(--darker) - .65) * 4));border:0;border-radius:3px;padding:5px;caret-color:var(--main);font-size:17px;border-bottom:#0000 3px solid;transition:all .3s;color:var(--active);height:auto}.auth-form-body .input-block:focus,.auth-form-body .input-block:hover{border-bottom:var(--main) 3px solid;box-shadow:#0002 0 10px 15px}.label-link{display:none !important}.btn-primary,.btn-primary:focus{background:var(--main) !important;border:none !important;border-radius:3px !important;box-shadow:#0002 0 3px 15px !important;font-size:16px !important;height:35px !important;transition:all .2s !important;cursor:default}.btn-primary:hover{filter:brightness(var(--lighter)) !important;box-shadow:#0002 0 10px 15px !important;transition:all .2s !important}.btn-primary:active{filter:brightness(var(--darker)) !important;box-shadow:#0002 0 0 3px !important;transition:all .1s !important}.create-account-callout,.footer,.header,.session-authentication .auth-form-header h1,.permission-help a,.text-small.text-gray.mb-0.text-center,button.btn.width-full.mr-2.ws-normal:nth-child(1),.muted-link.text-small{display:none}.flash.flash-full.flash-error{background:#e003;font-size:16px;padding:5px 10px;position:fixed;bottom:30px}.DashedConnection:before{border:0}.permission-help p{user-select:none}.permission-help p:after{content:' Clear Writer uses gists to store your cloud backup.'}::-webkit-scrollbar{width:7px;height:7px;background-color:#0000}::-webkit-scrollbar-track{background-color:#0000}::-webkit-scrollbar-thumb{background-color:#8885}::-webkit-scrollbar-thumb:hover{background-color:#8888}::-webkit-scrollbar-thumb:active{background-color:#888A}"
      // );
      if (!url.match(/\/callback.html/)) return;
      let code = url;
      let start = code.indexOf("?code=") + 6;
      let end =
        code.indexOf("&state") == -1 ? code.length : code.indexOf("&state");
      code = code.substring(start, end);
      $.ajax({
        type: "POST",
        url: `https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${gitee.CLIENT_ID}&redirect_uri=${gitee.REDIRECT_URL}`,
        data: {
          client_secret: gitee.CLIENT_SECRET,
        },
        success: (callback) => {
          console.log(callback);
          store.set("giteeToken", callback.access_token);
          store.set("giteeRefreshToken", callback.refresh_token);
          gitee.request(
            "GET /user",
            {},
            {
              callback: (data) => {
                console.log(data);
                store.set("giteeUsername", data.login);
                store.set("giteeAvatar", data.avatar_url);
                giteeSyncDiv.className = "connected";
                document.getElementById("gitee_avatar").src =
                  store.store.giteeAvatar;
                document.getElementById("gitee_username_span").innerHTML =
                  store.store.giteeUsername;
                authWin.close();
              },
              error: (err) => {
                authWin.close();
                console.error(err);
                tips(NET_ERR);
              },
            }
          );
        },
      });
    });
  },
  request: (string, data, config) => {
    let arr = string.split(" ");
    $.ajax({
      type: arr[0],
      url: `${gitee.API_URL + arr[1]}?access_token=${store.store.giteeToken}`,
      data: data,
      success: (req) => {
        if (config.callback) config.callback(req);
      },
      error: (err) => {
        if (config.error) config.error(err);
      },
    });
  },
  refreshToken: () => {
    $.ajax({
      type: "POST",
      url: `https://gitee.com/oauth/token?grant_type=refresh_token&refresh_token=${store.store.giteeRefreshToken}`,
      success: (data) => {
        console.log(data);
        store.set("giteeToken", data.access_token);
        store.set("giteeRefreshToken", data.refresh_token);
      },
      error: () => {
        tips(NET_ERR);
      },
    });
  },
  signOut: () => {
    store.delete("giteeAvatar");
    store.delete("giteeToken");
    store.delete("giteeRefreshToken");
    store.delete("giteeUsername");
    giteeSyncDiv.className = "unconnected";
    deleteCookie("gitee");
  },
  exportDataGist: () => {
    //tips(COLLECTING_DATA + "...");
    let day = new Date();
    let date =
      day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    let result = {};

    let file_list = `# ${FILE_LIST_TITLE}\n\n${THIS_IS_A_BACKUP.replace(
      "${VERSION}",
      VERSION
    ).replace("${date}", date)}\n\n`;
    for (let i = 0, l = nameArray.length; i < l; i++) {
      file_list += `- ${nameArray[i]}\n`;
    }
    result["ClearWriter_backup.md"] = { content: file_list };
    result["clear-writer-backup.json"] = { content: exportData(true) };
    tips(SENDING_DATA + "...");
    gitee.request(
      "POST /gists",
      {
        files: result,
        description: `Clear_Writer_Backup_${date}`,
        public: false,
      },
      {
        callback: () => {
          tips(SEND_SUCCEEDED);
        },
        error: (err) => {
          console.error(err);
          if (err.status == 500) {
            msgbox(
              SYNC_FAILED,
              `<div style="color:#000">${SYNC_FAILED_REASON}</div><button onclick="close_msgbox()">${OK}</botton>`,
              30,
              20,
              false,
              999
            );
          }
          tips(NET_ERR);
        },
      }
    );
  },
  importDataGist: () => {
    tips(PULLING_LIST + "...");
    gitee.request(
      "GET /gists",
      {},
      {
        callback: (arr) => {
          let string = '<ul id="import_list">';
          for (let i = 0, l = arr.length; i < l; i++) {
            if (!arr[i].files["clear-writer-backup.json"]) continue;
            string += `<li onclick=gitee.chooseGist('${arr[i].id}')>${arr[
              i
            ].description.replace(/^Clear_Writer_Backup_/, "")}</li>`;
          }
          string += "</ul>";
          msgbox(CHOOSE_BACKUP, string, 35, 25, false, 1001);
        },
        error: () => {
          tips(NET_ERR);
        },
      }
    );
  },
  chooseGist: async (id) => {
    close_msgbox();
    tips(DOWNLOADING_DATA + "...");
    gitee.request(
      `GET /gists/${id}`,
      {
        gist_id: id,
      },
      {
        callback: (data) => {
          tips(PARSING_DATA + "...");
          let cont = data.files["clear-writer-backup.json"].content;
          importData(cont);
        },
        error: () => {
          tips(NET_ERR);
        },
      }
    );
  },
};

function deleteCookie(site) {
  const { session } = remote;
  // 查询所有 cookies
  session.defaultSession.cookies
    .get({})
    .then((cookies) => {
      let l = cookies.length;
      for (let i = 0; i < l; i++) {
        if (!cookies[i].domain.match(site)) continue;
        let url = "";
        // get prefix, like https://www.
        url += cookies[i].secure ? "https://" : "http://";
        url += cookies[i].domain.charAt(0) === "." ? "www" : "";
        // append domain and path
        url += cookies[i].domain;
        url += cookies[i].path;
        session.defaultSession.cookies.remove(url, cookies[i].name, (error) => {
          if (error)
            console.error(`error removing cookie ${cookies[i].name}`, error);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
