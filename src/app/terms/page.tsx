export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-center sm:text-5xl mb-4">服务条款</h1>
          <p className="text-center text-muted-foreground mb-12">最后更新：2026年6月</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. 服务说明</h2>
              <p>闪映AI（以下简称「本平台」）是一个AI驱动的营销视频生成平台。用户通过本平台可以自动生成营销视频内容。本平台提供的所有服务均按「现状」提供。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. 用户账户</h2>
              <p>2.1 用户注册时需提供真实准确的手机号信息。</p>
              <p>2.2 用户应对其账户下的所有活动负责。</p>
              <p>2.3 禁止将账户转让或出售给他人使用。</p>
              <p>2.4 本平台保留随时暂停或终止违规账户的权利。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. 积分规则</h2>
              <p>3.1 积分是本平台的服务计量单位，用于支付各项功能的使用费用。</p>
              <p>3.2 积分永久有效，不设有效期。</p>
              <p>3.3 积分不可转让、不可兑换现金。</p>
              <p>3.4 通过充值码获取的积分，本平台确保其有效性。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. 内容规范</h2>
              <p>4.1 用户不得利用本平台生成违法、违规内容。</p>
              <p>4.2 用户不得生成侵犯他人知识产权的内容。</p>
              <p>4.3 用户不得生成虚假、误导性营销内容。</p>
              <p>4.4 违规内容一经发现，本平台有权删除并封禁相关账户。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. 知识产权</h2>
              <p>5.1 用户通过本平台生成的视频内容，其商业使用权归用户所有。</p>
              <p>5.2 本平台的软件、界面设计、商标等知识产权归本平台所有。</p>
              <p>5.3 AI生成内容的版权归属遵循相关法律法规。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. 免责声明</h2>
              <p>6.1 本平台不对AI生成内容的准确性和适当性做任何保证。</p>
              <p>6.2 因不可抗力导致的服务中断，本平台不承担责任。</p>
              <p>6.3 用户使用AI生成内容进行营销活动所产生的后果，由用户自行承担。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. 服务变更</h2>
              <p>本平台保留随时修改服务条款和功能的权利。重大变更将提前通知用户。</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
