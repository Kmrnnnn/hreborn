import { MapPin, Heart, Mail, Phone, Github, Twitter } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { label: "功能介绍", href: "#" },
      { label: "健康地图", href: "#" },
      { label: "AI推荐", href: "#" },
      { label: "数据分析", href: "#" },
    ],
    company: [
      { label: "关于我们", href: "#" },
      { label: "团队介绍", href: "#" },
      { label: "加入我们", href: "#" },
      { label: "联系我们", href: "#" },
    ],
    resources: [
      { label: "帮助中心", href: "#" },
      { label: "使用指南", href: "#" },
      { label: "API文档", href: "#" },
      { label: "博客", href: "#" },
    ],
    legal: [
      { label: "隐私政策", href: "#" },
      { label: "服务条款", href: "#" },
      { label: "数据安全", href: "#" },
    ],
  };

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-health flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <Heart className="absolute -bottom-1 -right-1 w-4 h-4 text-health-coral fill-health-coral" />
              </div>
              <span className="text-xl font-bold text-gradient-health">健康地图</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              结合AI智能与地图技术，为您打造个性化的健康管理平台。发现身边的健康资源，实现您的健康目标。
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shadow-soft">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shadow-soft">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shadow-soft">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">产品</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">公司</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">资源</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 健康地图. 保留所有权利.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link, index) => (
              <a key={index} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
