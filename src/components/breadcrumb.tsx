import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbComponentProps {
  currentPageName: string;
}

const BreadcrumbComponent = ({ currentPageName }: BreadcrumbComponentProps) => {
  return (
    <div className="flex justify-start lg:justify-end">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="" />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
