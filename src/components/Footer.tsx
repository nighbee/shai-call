const Footer = () => {
  return (
    <footer className="w-full bg-gradient-subtle border-t py-8 px-4 mt-12">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <span className="text-sm font-semibold text-business-primary">Shai.pro AI</span>
            <span className="text-sm text-muted-foreground">+</span>
            <span className="text-sm font-semibold text-business-secondary">Hackathon Team</span>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2024 Sales Call Analyzer. Built for enhanced sales performance.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;