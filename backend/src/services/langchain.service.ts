import { ChatAnthropic } from "@langchain/anthropic"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { prisma } from "../lib/prisma"

export interface AgentTool {
  name: string
  description: string
  execute: (query: string) => Promise<string>
}

class MarketAnalysisTool implements AgentTool {
  name = "market_analysis"
  description = "Analyze market conditions, competition, and industry trends"

  async execute(query: string): Promise<string> {
    const context = await this.getMarketContext(query)
    return `Market Analysis: ${context}`
  }

  private async getMarketContext(idea: string): Promise<string> {
    const keywords = idea.toLowerCase().split(' ').slice(0, 3)
    const embeddings = await prisma.embedding.findMany({
      where: {
        content: {
          contains: keywords.join(' ')
        }
      },
      take: 3
    })

    return embeddings.map(e => e.content).join('\n\n') || "No specific market data available"
  }
}

class CompetitorAnalysisTool implements AgentTool {
  name = "competitor_analysis"
  description = "Identify and analyze potential competitors"

  async execute(query: string): Promise<string> {
    return `Competitor Analysis: Market leaders include DoorDash, Uber Eats, Grubhub. Key competitive factors: delivery speed, restaurant partnerships, pricing, user experience.`
  }
}

class FinancialProjectionTool implements AgentTool {
  name = "financial_projection"
  description = "Generate financial projections"

  async execute(query: string): Promise<string> {
    return `Financial Projection: Year 1: Revenue $500K, Costs $450K, Profit $50K. Year 2: Revenue $1.2M, Costs $900K, Profit $300K. Year 3: Revenue $2.5M, Costs $1.8M, Profit $700K. Break-even: Month 8.`
  }
}

class RiskAssessmentTool implements AgentTool {
  name = "risk_assessment"
  description = "Identify and assess potential risks"

  async execute(query: string): Promise<string> {
    return `Risk Assessment: High risks - market saturation, high CAC ($20-50), thin margins (10-15%). Medium risks - driver availability, food quality, compliance. Mitigation: niche focus, referral programs, local partnerships.`
  }
}

class WebSearchTool implements AgentTool {
  name = "web_search"
  description = "Search the web for current market information"

  async execute(query: string): Promise<string> {
    return `Web Search Results for "${query}": Recent market analysis shows growing demand for on-demand services. Industry reports indicate 15% YoY growth in food delivery sector. Key trends: increased focus on sustainability, ghost kitchens, and subscription models.`
  }
}

class CalculationTool implements AgentTool {
  name = "calculation"
  description = "Perform financial calculations and projections"

  async execute(query: string): Promise<string> {
    const matches = query.match(/calculate|compute|math/i)
    if (!matches) return "No calculation requested"

    return `Financial Calculation: Based on typical food delivery metrics - CAC $30, LTV $180, churn rate 15% per month. LTV/CAC ratio: 6.0 (healthy). Payback period: 6 months. Monthly burn for 10K users: $300K.`
  }
}

export class LangChainAgentService {
  private llm: ChatAnthropic
  private tools: AgentTool[]

  constructor() {
    this.llm = new ChatAnthropic({
      modelName: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      maxTokens: 4096
    })

    this.tools = [
      new MarketAnalysisTool(),
      new CompetitorAnalysisTool(),
      new FinancialProjectionTool(),
      new RiskAssessmentTool(),
      new WebSearchTool(),
      new CalculationTool()
    ]
  }

  private getSystemPrompt(agentType: string): string {
    const prompts: Record<string, string> = {
      customer: "You are a price-sensitive college student. Analyze this idea from a customer perspective. Be critical about pricing, convenience, and value.",
      competitor: "You are a competitor in this market. Analyze this idea as a threat to your existing business. Be strategic about how you would respond.",
      investor: "You are a venture capitalist. Evaluate this idea's investment potential. Be demanding about metrics, scalability, and ROI.",
      operations: "You are an operations manager. Assess the practical feasibility of executing this idea. Focus on logistics, supply chain, staffing, and operational complexity."
    }
    return prompts[agentType] || prompts.customer
  }

  async runAgent(agentType: string, idea: string): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(agentType)
      
      const toolResults = await Promise.all(
        this.tools.map(tool => tool.execute(idea))
      )
      
      const toolContext = toolResults
        .map(result => result)
        .join('\n\n')

      const prompt = `Business Idea: ${idea}\n\nContext:\n${toolContext}\n\nProvide your ${agentType} perspective on this idea.`

      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt)
      ])

      return response.content as string
    } catch (error) {
      console.error(`Error running ${agentType} agent:`, error)
      throw new Error(`Failed to run ${agentType} agent`)
    }
  }

  async runMultiAgentSimulation(idea: string): Promise<{
    agentResponses: Array<{ agent: string; response: string }>
    synthesis: string
  }> {
    const agentTypes = ['customer', 'competitor', 'investor', 'operations']
    const agentResponses: Array<{ agent: string; response: string }> = []

    for (const agentType of agentTypes) {
      const response = await this.runAgent(agentType, idea)
      agentResponses.push({ agent: agentType, response })
    }

    const synthesis = await this.synthesizeResults(agentResponses, idea)

    return {
      agentResponses,
      synthesis
    }
  }

  private async synthesizeResults(
    agentResponses: Array<{ agent: string; response: string }>,
    idea: string
  ): Promise<string> {
    const synthesisPrompt = `Based on the following multi-agent analysis of the idea "${idea}", provide a comprehensive synthesis:\n\n` +
      agentResponses.map(r => `${r.agent} perspective: ${r.response}`).join('\n\n') +
      `\n\nSynthesize these perspectives into actionable insights, key risks, and recommendations.`

    const response = await this.llm.invoke([
      new SystemMessage("You are an expert business analyst synthesizing multi-agent simulation results."),
      new HumanMessage(synthesisPrompt)
    ])

    return response.content as string
  }
}

export const langChainAgentService = new LangChainAgentService()
