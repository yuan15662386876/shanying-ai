export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-center sm:text-5xl mb-4">免责声明</h1>
          <p className="text-center text-muted-foreground mb-12">最后更新：2026年6月</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. AI生成内容声明</h2>
              <p>本平台使用人工智能技术生成视频内容。AI生成的内容可能存在不准确、不完整或不适当的情况。用户在使用生成内容前应进行审核。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. 技术免责</h2>
              <p>2.1 本平台依赖第三方AI服务（包括但不限于DeepSeek、Fish Audio、HeyGen等）。</p>
              <p>2.2 第三方服务的可用性和质量不在本平台控制范围内。</p>
              <p>2.3 本平台不保证服务不中断或无错误。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. 营销效果免责</h2>
              <p>3.1 本平台生成的视频内容仅供营销参考。</p>
              <p>3.2 本平台不对视频的营销效果、转化率或商业收益做任何保证。</p>
              <p>3.3 用户应自行评估和承担使用AI生成内容进行营销的风险。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. 第三方链接</h2>
              <p>4.1 用户输入的商品链接或外部URL，其内容由第三方提供。</p>
              <p>4.2 本平台不对第三方链接内容的真实性、合法性负责。</p>
              <p>4.3 用户应确保有权使用其输入的链接内容。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. 声音克隆与数字人</h2>
              <p>5.1 声音克隆和数字人形象创建功能仅供合法用途。</p>
              <p>5.2 用户不得克隆他人声音或形象用于欺诈、冒充等违法活动。</p>
              <p>5.3 用户需确保拥有上传音频/视频内容的合法权利。</p>
              <p>5.4 违规使用导致的任何法律后果由用户自行承担。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. 数据安全</h2>
              <p>6.1 本平台采用行业标准的安全措施保护用户数据。</p>
              <p>6.2 用户上传的内容仅用于提供服务和改进AI模型。</p>
              <p>6.3 本平台不会将用户内容用于其他商业目的。</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
