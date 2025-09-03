import * as React from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';

const AccordionDemo = () => (
  <Accordion.Root
    className='w-[300px] rounded-md bg-mauve6 shadow-[0_2px_10px] shadow-black/5'
    type='single'
    defaultValue='item-1'
    collapsible
  >
    <AccordionItem value='item-1'>
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value='item-2'>
      <AccordionTrigger>Is it unstyled?</AccordionTrigger>
      <AccordionContent>
        Yes. It&apos;s unstyled by default, giving you freedom over the look and
        feel.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value='item-3'>
      <AccordionTrigger>Can it be animated?</AccordionTrigger>
      <AccordionContent>
        Yes! You can animate the Accordion with CSS or JavaScript.
      </AccordionContent>
    </AccordionItem>
  </Accordion.Root>
);

type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Item
> & {
  children?: React.ReactNode;
  className?: string;
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-mauve12',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);

AccordionItem.displayName = 'AccordionItem';

type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Trigger
> & {
  children?: React.ReactNode;
  className?: string;
};

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className='flex'>
    <Accordion.Trigger
      className={classNames(
        'group flex h-[45px] flex-1 cursor-default items-center justify-between bg-mauve1 px-5 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-mauve6 outline-none hover:bg-mauve2',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <svg
        className='text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180'
        width='15'
        height='15'
        viewBox='0 0 15 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden
      >
        <path
          d='M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z'
          fill='currentColor'
          fillRule='evenodd'
          clipRule='evenodd'
        />
      </svg>
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Content
> & {
  children?: React.ReactNode;
  className?: string;
};

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames(
      'overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className='px-5 py-[15px]'>{children}</div>
  </Accordion.Content>
));

AccordionContent.displayName = 'AccordionContent';

export { AccordionDemo, AccordionItem, AccordionTrigger, AccordionContent };
export default AccordionDemo;
