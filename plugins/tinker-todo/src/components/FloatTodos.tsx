import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import className from 'licia/className'
import { tw } from 'share/theme'
import store from '../store'

interface FloatTodosProps {
  onClose: () => void
}

const PRIORITY_COLORS: Record<string, string> = {
  A: 'text-red-500',
  B: 'text-yellow-500',
  C: 'text-blue-500',
}

export default observer(function FloatTodos({ onClose }: FloatTodosProps) {
  const { t } = useTranslation()
  const todos = store.todayTodos

  return (
    <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
      <div
        className={`flex items-center px-3 py-2 border-b ${tw.border}`}
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className={`text-sm font-medium ${tw.text.primary}`}>
          {t('today')}
        </span>
        <span className={`ml-2 text-xs ${tw.text.secondary}`}>
          {todos.length}
        </span>
        <div className="flex-1" />
        <button
          className={`p-0.5 rounded ${tw.hover} ${tw.text.secondary}`}
          onClick={onClose}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {todos.length === 0 ? (
          <div className={`text-center text-sm py-8 ${tw.text.secondary}`}>
            {t('noTasks')}
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={className(
                'flex items-center gap-2 px-2 py-1.5 rounded',
                tw.hover,
                todo.completed && 'opacity-60'
              )}
            >
              <button
                onClick={() => store.toggleTodo(todo.id)}
                className={className(
                  'flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  todo.completed
                    ? [tw.primary.bg, tw.primary.border]
                    : tw.border
                )}
              >
                {todo.completed && <Check size={10} className="text-white" />}
              </button>
              <span
                className={className(
                  'flex-1 text-sm',
                  todo.completed
                    ? ['line-through', tw.text.secondary]
                    : tw.text.primary
                )}
              >
                {todo.text}
              </span>
              {todo.priority && (
                <span
                  className={`text-xs font-medium ${
                    PRIORITY_COLORS[todo.priority]
                  }`}
                >
                  {todo.priority}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
})
