check: async () => {
    const { data } = await supabaseBrowserClient.auth.getSession();
    if (!data.session) {
      return {
        authenticated: false,
        // 删掉 redirectTo: "/login"，因为 middleware 已经做了。
        // 这里的关键是：不要返回任何会导致框架自动跳回 "/" 的东西
      };
    }
    return {
      authenticated: true,
    };
  },