import Link from "next/link";
import {
  FileText,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  BookOpen,
  Clock,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Veda</span>{" "}
              <span className="text-foreground/80">AI</span>
            </span>
          </div>
          <Link
            href="/create"
            className="gradient-primary text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            Create Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-8 animate-slide-up">
            <Zap className="w-4 h-4" />
            AI-Powered Assessment Generation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Create{" "}
            <span className="gradient-text">Professional</span>
            <br />
            Question Papers in
            <br />
            <span className="gradient-text">Seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">
            Transform your teaching workflow with AI-powered assessment
            creation. Generate structured, exam-ready question papers with
            intelligent difficulty distribution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href="/create"
              className="gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <FileText className="w-5 h-5" />
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-violet-200 text-violet-700 hover:bg-violet-50 transition-all duration-300 w-full sm:w-auto text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Create Assessments</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A powerful suite of tools designed for modern educators
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Generation",
                description:
                  "Advanced LLM generates contextually relevant questions with proper difficulty distribution",
                color: "violet",
              },
              {
                icon: BookOpen,
                title: "Multiple Question Types",
                description:
                  "Support for MCQs, subjective, short answer, true/false, and more question formats",
                color: "blue",
              },
              {
                icon: Shield,
                title: "Structured Output",
                description:
                  "Every question paper follows a clean, validated JSON structure for consistency",
                color: "emerald",
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                description:
                  "WebSocket-powered live updates so you see results as they're generated",
                color: "amber",
              },
              {
                icon: BarChart3,
                title: "Difficulty Balancing",
                description:
                  "Intelligent distribution of easy, medium, and hard questions across sections",
                color: "rose",
              },
              {
                icon: FileText,
                title: "PDF Export",
                description:
                  "Export beautifully formatted question papers ready for printing or distribution",
                color: "cyan",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`w-6 h-6 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Ready to Transform Your
              <br />
              Assessment Workflow?
            </h2>
            <p className="text-white/80 text-lg mb-8 relative z-10">
              Join educators who are saving hours with AI-powered question
              generation
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 bg-white text-violet-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative z-10"
            >
              <Sparkles className="w-5 h-5" />
              Create Your First Paper
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Veda AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Veda AI. Built with ❤️ for educators.
          </p>
        </div>
      </footer>
    </div>
  );
}
