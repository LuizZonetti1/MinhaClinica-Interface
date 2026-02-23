import { Container, TabsList, TabButton, TabContent } from './styles';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tabs = ({ tabs, activeTab, onTabChange, children }: TabsProps) => {
  return (
    <Container>
      <TabsList>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.icon && <span className="icon">{tab.icon}</span>}
            {tab.label}
          </TabButton>
        ))}
      </TabsList>
      <TabContent>{children}</TabContent>
    </Container>
  );
};
