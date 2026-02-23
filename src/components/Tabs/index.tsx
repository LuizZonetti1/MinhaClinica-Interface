import { Check, Lock } from "lucide-react";
import { Container, TabButton, TabContent, TabsList } from "./styles";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  completed?: boolean;
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
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            $disabled={tab.disabled}
            $completed={tab.completed}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            type="button"
            disabled={tab.disabled}
          >
            {tab.completed ? (
              <span className="icon">
                <Check />
              </span>
            ) : tab.disabled ? (
              <span className="icon">
                <Lock />
              </span>
            ) : (
              tab.icon && <span className="icon">{tab.icon}</span>
            )}
            {tab.label}
          </TabButton>
        ))}
      </TabsList>
      <TabContent>{children}</TabContent>
    </Container>
  );
};
