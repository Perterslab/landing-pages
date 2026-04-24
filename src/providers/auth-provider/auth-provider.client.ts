check: async () => {
    const { data } = await supabaseBrowserClient.auth.getSession();
    if (!data.session) {
      return { authenticated: false }; // 删掉所有 redirectTo，不准瞎跳！
    }
    return { authenticated: true };
  },

  onError: async (error) => {
    console.error("Auth 错误:", error);
    return { error }; // 遇到错误也不准跳，原地待命！
  },