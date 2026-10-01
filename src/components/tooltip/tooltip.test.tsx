import { render, screen } from '@testing-library/react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@nomos/components/tooltip/tooltip'

/** L'infobulle est un atome du cœur : elle se rend seule, sans provider d'app. */
describe('Tooltip', () => {
  it('renders the bubble inside its provider, without any application provider', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Aide</TooltipTrigger>
          <TooltipContent>Texte d’aide</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByText('Texte d’aide')).toBeInTheDocument()
  })

  it('lets the application merge its own classes on the bubble', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Aide</TooltipTrigger>
          <TooltipContent className="max-w-xs">Texte</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole('tooltip')).toHaveClass('max-w-xs')
  })
})
